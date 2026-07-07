using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(
        AppDbContext context, 
        ILogger<ChatController> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ChatController> _logger = logger;
        private readonly IConfiguration _configuration = configuration;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> SendMessage([FromBody] ChatRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Unauthorized Access." });

            if (string.IsNullOrWhiteSpace(request.MunicipalityId))
                return BadRequest(new { message = Consts.MunicipalityIdRequired });

            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = Consts.ChatMessageRequired });

            _logger.LogInformation("Chat request from User: {UserId} in Municipality: {MunicipalityId}", userId, request.MunicipalityId);

            bool isValidTourismQuery = await ValidateDomainScopeWithLlmAsync(request.Message);

            if (!isValidTourismQuery)
            {
                _logger.LogWarning("LLM Domain restriction triggered. Query out of scope. User: {UserId}", userId);
                return Ok(new ChatResponseDto { Reply = Consts.OutOfScopeRejection });
            }

            var retrievedContext = await RetrieveTourismDataAsync(request.Message);

            if (string.IsNullOrWhiteSpace(retrievedContext))
                return Ok(new ChatResponseDto { Reply = Consts.NoDataGracefulFallback });

            var finalReply = await GenerateContextualAnswerWithLlmAsync(request.Message, retrievedContext);

            if (finalReply.Trim().Equals("INSUFFICIENT_DATA", StringComparison.OrdinalIgnoreCase))
                return Ok(new ChatResponseDto { Reply = Consts.NoDataGracefulFallback });

            return Ok(new ChatResponseDto { Reply = finalReply });
        }

        private async Task<bool> ValidateDomainScopeWithLlmAsync(string userMessage)
        {
            string llmResponse = await CallGeminiLlmAsync(Consts.IntentClassifierSystemPrompt, userMessage);
            return llmResponse.Trim().Equals("TRUE", StringComparison.OrdinalIgnoreCase);
        }

        private async Task<string> RetrieveTourismDataAsync(string userMessage)
        {
            var queryEmbedding = await GenerateEmbeddingAsync(userMessage);
            var embeddingString = "[" + string.Join(",", queryEmbedding.Select(e => e.ToString(CultureInfo.InvariantCulture))) + "]";

            var relevantData = await _context.Database.SqlQueryRaw<MatchAppDataResultDTO>(
                "SELECT id as Id, name as Name, description as Description, source_table as SourceTable, similarity as Similarity " +
                "FROM match_app_data({0}::vector, {1}, {2})",
                embeddingString, 0.2, 5
            ).ToListAsync();

            if (relevantData.Count == 0) return string.Empty;

            var contextBuilder = new StringBuilder();

            foreach (var item in relevantData)
            {
                string entityType = item.SourceTable?.ToLower() switch
                {
                    "organizations" => "Organization/Entity",
                    "routes" => "Tourist Route",
                    "pois" => "Point of Interest",
                    "services" => "Public Service",
                    "articles" => "Article/News",
                    _ => "Information"
                };

                contextBuilder.AppendLine($"[{entityType}] Name: {item.Name} | Details: {item.Description}");
            }

            return contextBuilder.ToString();
        }

        private async Task<string> GenerateContextualAnswerWithLlmAsync(string userMessage, string contextData)
        {
            string formattedSystemPrompt = string.Format(Consts.AnswerGenerationSystemPrompt, contextData);
            return await CallGeminiLlmAsync(formattedSystemPrompt, userMessage);
        }

        private async Task<double[]> GenerateEmbeddingAsync(string text)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={apiKey}";

            var requestBody = new
            {
                model = "models/text-embedding-004",
                content = new
                {
                    parts = new[] { new { text } }
                }
            };

            using var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API Error (Embedding): {response.StatusCode} - {errorBody}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(responseString);

            var values = jsonNode?["embedding"]?["values"]?.AsArray();
            if (values == null) return new double[768];

            return [.. values.Select(v => v?.GetValue<double>() ?? 0.0)];
        }

        private async Task<string> CallGeminiLlmAsync(string systemPrompt, string userMessage)
        {
            var apiKey = _configuration["Gemini:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new Exception("CRITICAL ERROR: Gemini API Key is missing or empty.");
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={apiKey}";

            var requestBody = new
            {
                system_instruction = new { parts = new[] { new { text = systemPrompt } } },
                contents = new[] { new { role = "user", parts = new[] { new { text = userMessage } } } }
            };

            using var client = _httpClientFactory.CreateClient();

            int maxRetries = 3;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    var jsonNode = JsonNode.Parse(responseString);
                    var answerText = jsonNode?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.GetValue<string>();
                    return answerText ?? string.Empty;
                }

                if ((int)response.StatusCode == 503 || (int)response.StatusCode == 429)
                {
                    if (attempt == maxRetries)
                    {
                        var finalError = await response.Content.ReadAsStringAsync();
                        throw new HttpRequestException($"Gemini API Error: Dopo {maxRetries} tentativi, il server è ancora occupato. {response.StatusCode} - {finalError}");
                    }

                    _logger.LogWarning("Gemini API occupata (503). Tentativo {Attempt} fallito. Riprovo tra poco...", attempt);
                    await Task.Delay(2000 * attempt);
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Gemini API Error (Generation): {response.StatusCode} - {errorBody}");
                }
            }

            return string.Empty;
        }
    }
}
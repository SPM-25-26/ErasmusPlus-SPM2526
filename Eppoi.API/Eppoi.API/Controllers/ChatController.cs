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
    public class ChatController(
        AppDbContext context,
        ILogger<ChatController> logger,
        GeminiHelper geminiHelper) : ControllerBase 
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly GeminiHelper _geminiHelper = geminiHelper;
        private readonly IConfiguration _configuration = configuration;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> SendMessage([FromBody] ChatRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Unauthorized access." });

            if (string.IsNullOrWhiteSpace(request.Message))
            try

                var embeddingResponse = await _geminiHelper.GenerateEmbeddingAsync(
                    request.Message,
                    "RETRIEVAL_QUERY",
                    768
                );
                return Ok(new ChatResponseDto { Reply = Consts.OutOfScopeRejection });
                if (embeddingResponse?.Embedding?.Values == null)
                    return StatusCode(500, new { message = "Errore embedding Gemini." });

                var queryEmbedding = embeddingResponse.Embedding.Values;
                var embeddingString = "[" + string.Join(",", queryEmbedding.Select(e => e.ToString(CultureInfo.InvariantCulture))) + "]";
            var queryEmbedding = await GenerateEmbeddingAsync(userMessage);
            var embeddingString = "[" + string.Join(",", queryEmbedding.Select(e => e.ToString(CultureInfo.InvariantCulture))) + "]";

                var relevantData = await _context.Database.SqlQueryRaw<MatchAppDataResultDTO>(
                    "SELECT id as Id, \"officialName\" as Name, description as Description, 'pois' as SourceTable, 1 - (embedding <=> {0}::vector) as Similarity " +
                    "FROM pois " +
                    "WHERE embedding IS NOT NULL " +
                    "ORDER BY embedding <=> {0}::vector " +
                    "LIMIT 5",
                    embeddingString
                var contextText = new StringBuilder();
                foreach (var item in relevantData)
                {
                    contextText.AppendLine($"[Point of Interest] Name: {item.Name} | Details: {item.Description}");
                }
                contextBuilder.AppendLine($"[{entityType}] Name: {item.Name} | Details: {item.Description}");
            }

                string systemRules = string.Format(Consts.UnifiedChatbotSystemPrompt, contextText.ToString());
                var answer = generationResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text ?? string.Empty;

                if (answer.Trim().Equals("OUT_OF_SCOPE", StringComparison.OrdinalIgnoreCase))
                    return Ok(new ChatResponseDto { Reply = Consts.OutOfScopeRejection });

                if (answer.Trim().Equals("INSUFFICIENT_DATA", StringComparison.OrdinalIgnoreCase))
                    return Ok(new ChatResponseDto { Reply = Consts.NoDataGracefulFallback });
                        throw new HttpRequestException($"Gemini API Error: Dopo {maxRetries} tentativi, il server è ancora occupato. {response.StatusCode} - {finalError}");
                return Ok(new ChatResponseDto { Reply = answer });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore nel ChatController");
                return StatusCode(500, new { message = ex.Message });
            }

            return string.Empty;
        }
    }
}
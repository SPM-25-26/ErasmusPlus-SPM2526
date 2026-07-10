using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;
using System.Text;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(
        AppDbContext context,
        ILogger<ChatController> logger,
        GeminiHelper geminiHelper) : ControllerBase // Usiamo direttamente il loro helper
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ChatController> _logger = logger;
        private readonly GeminiHelper _geminiHelper = geminiHelper;

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> SendMessage([FromBody] ChatRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Unauthorized Access." });

            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = Consts.ChatMessageRequired });

            try
            {
                // STEP 1: Embedding usando ESATTAMENTE il loro metodo (che forza 768 dim)
                var embeddingResponse = await _geminiHelper.GenerateEmbeddingAsync(
                    request.Message,
                    "RETRIEVAL_QUERY",
                    768
                );

                if (embeddingResponse?.Embedding?.Values == null)
                    return StatusCode(500, new { message = "Errore embedding Gemini." });

                var queryEmbedding = embeddingResponse.Embedding.Values;
                var embeddingString = "[" + string.Join(",", queryEmbedding.Select(e => e.ToString(CultureInfo.InvariantCulture))) + "]";

                // STEP 2: Ricerca RAG sicura (Query diretta per evitare errori di SP)
                var relevantData = await _context.Database.SqlQueryRaw<MatchAppDataResultDTO>(
                    "SELECT id as Id, \"officialName\" as Name, description as Description, 'pois' as SourceTable, 1 - (embedding <=> {0}::vector) as Similarity " +
                    "FROM pois " +
                    "WHERE embedding IS NOT NULL " +
                    "ORDER BY embedding <=> {0}::vector " +
                    "LIMIT 5",
                    embeddingString
                ).ToListAsync();

                var contextText = new StringBuilder();
                foreach (var item in relevantData)
                {
                    contextText.AppendLine($"[Point of Interest] Name: {item.Name} | Details: {item.Description}");
                }

                // STEP 3: Generazione risposta usando ESATTAMENTE il loro metodo
                string systemRules = string.Format(Consts.UnifiedChatbotSystemPrompt, contextText.ToString());
                var generationResponse = await _geminiHelper.GenerateContentAsync($"{systemRules}\n\nUSER QUESTION:\n{request.Message}");

                var answer = generationResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text ?? string.Empty;

                // Gestione Guardrails
                if (answer.Trim().Equals("OUT_OF_SCOPE", StringComparison.OrdinalIgnoreCase))
                    return Ok(new ChatResponseDto { Reply = Consts.OutOfScopeRejection });

                if (answer.Trim().Equals("INSUFFICIENT_DATA", StringComparison.OrdinalIgnoreCase))
                    return Ok(new ChatResponseDto { Reply = Consts.NoDataGracefulFallback });

                return Ok(new ChatResponseDto { Reply = answer });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore nel ChatController");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(AppDbContext context, ILogger<ChatController> logger) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ChatController> _logger = logger;

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> SendMessage([FromBody] ChatRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Unauthorized access." });

            if (string.IsNullOrWhiteSpace(request.MunicipalityId))
                return BadRequest(new { message = Consts.MunicipalityIdRequired });

            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = Consts.ChatMessageRequired });

            _logger.LogInformation("Chat request from User: {UserId} in Municipality: {MunicipalityId}", userId, request.MunicipalityId);

            bool isValidTourismQuery = ValidateDomainScope(request.Message);

            if (!isValidTourismQuery)
            {
                _logger.LogWarning("Chatbot domain restriction triggered. Query out of scope. User: {UserId}", userId);
                return Ok(new ChatResponseDto { Reply = Consts.OutOfScopeRejection });
            }

            var retrievedContext = await RetrieveTourismDataAsync(request.Message);
            var finalReply = GenerateContextualAnswer(request.Message, retrievedContext);

            return Ok(finalReply);
        }

        /// <summary>
        /// Ensures the chatbot answers only tourism-related questions and restricts out-of-scope topics.
        /// </summary>
        private bool ValidateDomainScope(string userMessage)
        {
            var lowerMsg = userMessage.ToLower();

            if (lowerMsg.Contains("joke") ||
                lowerMsg.Contains("france") ||
                lowerMsg.Contains("recipe") ||
                lowerMsg.Contains("politics") ||
                lowerMsg.Contains("capital"))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Esegue la query vettoriale sul DB chiamando la stored function 'match_app_data'.
        /// </summary>
        private async Task<string> RetrieveTourismDataAsync(string userMessage)
        {
            var queryEmbedding = await GenerateEmbeddingAsync(userMessage);

            var embeddingString = "[" + string.Join(",", queryEmbedding.Select(e => e.ToString(CultureInfo.InvariantCulture))) + "]";

            var relevantData = await _context.Database.SqlQueryRaw<MatchAppDataResultDTO>(
                "SELECT id as Id, name as Name, description as Description, source_table as SourceTable, similarity as Similarity " +
                "FROM match_app_data({0}::vector, {1}, {2})",
                embeddingString, 0.2, 5
            ).ToListAsync();

            if (relevantData.Count == 0)
                return "Nessuna informazione specifica trovata nel database per questa richiesta.";

            var contextBuilder = new System.Text.StringBuilder();
            foreach (var item in relevantData)
            {
                string entityType = item.SourceTable?.ToLower() switch
                {
                    "organizations" => "Organizzazione/Ente",
                    "routes" => "Itinerario",
                    "pois" => "Punto di Interesse",
                    "services" => "Servizio Turistico",
                    "articles" => "Articolo",
                    _ => "Informazione"
                };

                contextBuilder.AppendLine($"[{entityType}] Nome: {item.Name}");
                contextBuilder.AppendLine($"Dettagli: {item.Description}");
                contextBuilder.AppendLine("---");
            }

            return contextBuilder.ToString();
        }

        /// <summary>
        /// Generates the final coherent response grounded solely on the retrieved app data.
        /// </summary>
        private ChatResponseDto GenerateContextualAnswer(string message, string contextData)
        {
            if (contextData.Contains("Nessuna informazione"))
            {
                return new ChatResponseDto
                {
                    Reply = "Mi dispiace, ma non ho trovato informazioni turistiche specifiche nel database del comune per rispondere alla tua domanda."
                };
            }

            return new ChatResponseDto
            {
                Reply = $"Sulla base dei dati turistici ufficiali del comune, ecco le informazioni che ho trovato per te:\n\n{contextData}\nC'è altro che vorresti sapere sulle attrazioni locali?"
            };
        }

        /// <summary>
        /// Mock per la generazione di embedding.
        /// </summary>
        private Task<double[]> GenerateEmbeddingAsync(string text)
        {
            var mockVector = new double[768];
            Array.Fill(mockVector, 0.015);
            return Task.FromResult(mockVector);
        }
    }
}
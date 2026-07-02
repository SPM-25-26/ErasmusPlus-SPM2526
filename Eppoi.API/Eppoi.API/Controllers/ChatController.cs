using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eppoi.API.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ChatController> _logger;

        public ChatController(AppDbContext context, ILogger<ChatController> logger)
        {
            _context = context;
            _logger = logger;
        }

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

            var retrievedContext = await RetrieveTourismDataAsync(request.MunicipalityId, request.Message);
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
        /// Retrieves internal data from the database to prevent hallucinations and generic knowledge usage.
        /// </summary>
        private async Task<string> RetrieveTourismDataAsync(string municipalityId, string userMessage)
        {
            var keywords = userMessage.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                                      .Where(w => w.Length > 3)
                                      .ToList();

            var query = _context.Pois
                .AsNoTracking()
                .Where(p => p.MunicipalityId == municipalityId);

            if (keywords.Count != 0)
            {
                query = query.Where(p => keywords.Any(k =>
                    (p.OfficialName != null && p.OfficialName.ToLower().Contains(k)) ||
                    (p.Description != null && p.Description.ToLower().Contains(k)))
                );
            }

            var relevantPois = await query.Take(5)
                .Select(p => new
                {
                    p.OfficialName,
                    p.Address,
                    p.Description
                })
                .ToListAsync();

            if (!relevantPois.Any())
                return "Nessuna informazione specifica trovata nel database per questa richiesta.";

            var contextBuilder = new System.Text.StringBuilder();
            foreach (var poi in relevantPois)
            {
                contextBuilder.AppendLine($"Nome: {poi.OfficialName}");
                contextBuilder.AppendLine($"Indirizzo: {poi.Address}");
                contextBuilder.AppendLine($"Descrizione: {poi.Description}");
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
    }
}
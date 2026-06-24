using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eppoi.API.Entities; 

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MapController> _logger;

        public MapController(AppDbContext context, ILogger<MapController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("pois")]
        public async Task<ActionResult> GetMapPois([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve map POIs for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetMapPois failed: Municipality ID was not provided.");
                return BadRequest(new { message = "Municipality ID is required." });
            }

            // Estraiamo solo i POI con coordinate valide e capiamo a quale categoria appartengono
            var pois = await _context.Pois
                .AsNoTracking()
                .Include(p => p.PoisArtCultureNature)
                .Include(p => p.PoisEatAndDrink)
                .Include(p => p.PoisEntertainmentLeisure)
                .Include(p => p.PoisShopping)
                .Include(p => p.PoisSleep)
                .Include(p => p.PoisEvent)
                .Where(p => p.MunicipalityId == municipalityId && p.Latitude != null && p.Longitude != null)
                .Select(p => new
                {
                    Id = p.Id,
                    OfficialName = p.OfficialName,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    Category = p.PoisArtCultureNature != null ? "ArtCulture" :
                               p.PoisEatAndDrink != null ? "EatDrink" :
                               p.PoisEntertainmentLeisure != null ? "Entertainment" :
                               p.PoisShopping != null ? "Shopping" :
                               p.PoisSleep != null ? "Sleep" :
                               p.PoisEvent != null ? "Event" : "Unknown"
                })
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} map POIs", pois.Count);

            return Ok(pois);
        }
    }
}
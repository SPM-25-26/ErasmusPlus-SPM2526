using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/pois/culture")] 
    [ApiController]
    public class ArtCultureController(AppDbContext context, ILogger<ArtCultureController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ArtCultureController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtCultureSummaryDto>>> GetArtCultureLocations([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve art and culture locations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetArtCultureLocations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var locations = await _context.PoisArtCultureNatures
                .AsNoTracking()
                .Where(p => p.IdNavigation.MunicipalityId == municipalityId)
                .OrderBy(p => p.IdNavigation.OfficialName)
                .ProjectTo<ArtCultureSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} art and culture locations for municipality: {MunicipalityId}", locations.Count, municipalityId);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArtCultureDetailDto>> GetArtCultureDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for art and culture location ID: {LocationId}", id);

            var locationDetail = await _context.PoisArtCultureNatures
                .AsNoTracking()
                .Where(p => p.Id == id)
                .ProjectTo<ArtCultureDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (locationDetail == null)
            {
                _logger.LogWarning("GetArtCultureDetail failed: Location with ID {LocationId} not found.", id);
                return NotFound(new { message = Consts.ArtCultureLocationNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for art and culture location ID: {LocationId}", id);

            return Ok(locationDetail);
        }
    }
}
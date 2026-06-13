using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/pois/entertainment")] 
    [ApiController]
    public class EntertainmentController(AppDbContext context, ILogger<EntertainmentController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<EntertainmentController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntertainmentSummaryDto>>> GetEntertainmentLocations([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve entertainment locations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetEntertainmentLocations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var locations = await _context.PoisEntertainmentLeisures
                .AsNoTracking()
                .Where(p => p.IdNavigation.MunicipalityId == municipalityId)
                .OrderBy(p => p.IdNavigation.OfficialName)
                .ProjectTo<EntertainmentSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} entertainment locations for municipality: {MunicipalityId}", locations.Count, municipalityId);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EntertainmentDetailDto>> GetEntertainmentDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for entertainment location ID: {LocationId}", id);

            var locationDetail = await _context.PoisEntertainmentLeisures
                .AsNoTracking()
                .Where(p => p.Id == id)
                .ProjectTo<EntertainmentDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (locationDetail == null)
            {
                _logger.LogWarning("GetEntertainmentDetail failed: Location with ID {LocationId} not found.", id);
                return NotFound(new { message = Consts.EntertainmentLocationNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for entertainment location ID: {LocationId}", id);

            return Ok(locationDetail);
        }
    }
}
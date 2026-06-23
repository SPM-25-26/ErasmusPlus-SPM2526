using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/pois/sleep")] 
    [ApiController]
    public class SleepController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SleepController> _logger;
        private readonly IMapper _mapper;

        public SleepController(AppDbContext context, ILogger<SleepController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SleepSummaryDto>>> GetAccommodations([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve accommodations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetAccommodations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var accommodations = await _context.PoisSleeps
                .AsNoTracking()
                .Where(p => p.IdNavigation.MunicipalityId == municipalityId)
                .OrderBy(p => p.IdNavigation.OfficialName)
                .ProjectTo<SleepSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} accommodations for municipality: {MunicipalityId}", accommodations.Count, municipalityId);

            return Ok(accommodations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SleepDetailDto>> GetAccommodationDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for accommodation ID: {LocationId}", id);

            var accommodationDetail = await _context.PoisSleeps
                .AsNoTracking()
                .Where(p => p.Id == id)
                .ProjectTo<SleepDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (accommodationDetail == null)
            {
                _logger.LogWarning("GetAccommodationDetail failed: Accommodation with ID {LocationId} not found.", id);
                return NotFound(new { message = Consts.SleepLocationNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for accommodation ID: {LocationId}", id);

            return Ok(accommodationDetail);
        }
    }
}
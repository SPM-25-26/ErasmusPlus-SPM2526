using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/pois/eat-drink")] 
    [ApiController]
    public class EatAndDrinkController(AppDbContext context, ILogger<EatAndDrinkController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<EatAndDrinkController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EatAndDrinkSummaryDto>>> GetEatAndDrinkLocations([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve eat and drink locations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetEatAndDrinkLocations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var locations = await _context.PoisEatAndDrinks
                .AsNoTracking()
                .Where(p => p.IdNavigation.MunicipalityId == municipalityId)
                .OrderBy(p => p.IdNavigation.OfficialName)
                .ProjectTo<EatAndDrinkSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} eat and drink locations for municipality: {MunicipalityId}", locations.Count, municipalityId);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EatAndDrinkDetailDto>> GetEatAndDrinkDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for eat and drink location ID: {LocationId}", id);

            var locationDetail = await _context.PoisEatAndDrinks
                .AsNoTracking()
                .Where(p => p.Id == id)
                .ProjectTo<EatAndDrinkDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (locationDetail == null)
            {
                _logger.LogWarning("GetEatAndDrinkDetail failed: Location with ID {LocationId} not found.", id);
                return NotFound(new { message = Consts.EatAndDrinkNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for eat and drink location ID: {LocationId}", id);

            return Ok(locationDetail);
        }
    }
}
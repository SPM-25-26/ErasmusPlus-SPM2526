using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/pois/shopping")] 
    [ApiController]
    public class ShoppingController(AppDbContext context, ILogger<ShoppingController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ShoppingController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShoppingSummaryDto>>> GetShoppingLocations([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve shopping locations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetShoppingLocations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var locations = await _context.PoisShoppings
                .AsNoTracking()
                .Where(s => s.IdNavigation.MunicipalityId == municipalityId)
                .OrderBy(s => s.IdNavigation.OfficialName)
                .ProjectTo<ShoppingSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} shopping locations for municipality: {MunicipalityId}", locations.Count, municipalityId);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ShoppingDetailDto>> GetShoppingDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for shopping location ID: {LocationId}", id);

            var locationDetail = await _context.PoisShoppings
                .AsNoTracking()
                .Where(s => s.Id == id)
                .ProjectTo<ShoppingDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (locationDetail == null)
            {
                _logger.LogWarning("GetShoppingDetail failed: Location with ID {LocationId} not found.", id);
                return NotFound(new { message = Consts.ShoppingLocationNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for shopping location ID: {LocationId}", id);

            return Ok(locationDetail);
        }
    }
}
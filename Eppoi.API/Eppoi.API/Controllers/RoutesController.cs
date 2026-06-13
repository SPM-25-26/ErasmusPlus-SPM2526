using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController(AppDbContext context, ILogger<RoutesController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<RoutesController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteSummaryDto>>> GetRoutes([FromQuery] string municipalityId)
        {
            _logger.LogInformation("Attempting to retrieve routes for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetRoutes failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var routes = await _context.Routes
                .AsNoTracking()
                .Where(r => r.MunicipalityId == municipalityId)
                .OrderBy(r => r.Name)
                .ProjectTo<RouteSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} routes for municipality: {MunicipalityId}", routes.Count, municipalityId);

            return Ok(routes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RouteDetailDto>> GetRouteDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for route ID: {RouteId}", id);

            var routeDetail = await _context.Routes
                .AsNoTracking()
                .Where(r => r.Id == id)
                .ProjectTo<RouteDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (routeDetail == null)
            {
                _logger.LogWarning("GetRouteDetail failed: Route with ID {RouteId} not found.", id);
                return NotFound(new { message = Consts.RouteNotFound });
            }

            if (routeDetail.RouteStages != null && routeDetail.RouteStages.Any())
            {
                routeDetail.RouteStages = [.. routeDetail.RouteStages.OrderBy(s => s.Number ?? int.MaxValue)];
            }

            _logger.LogInformation("Successfully retrieved details for route ID: {RouteId}", id);

            return Ok(routeDetail);
        }
    }
}
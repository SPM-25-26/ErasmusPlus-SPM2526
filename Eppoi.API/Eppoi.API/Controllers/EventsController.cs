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
    public class EventsController(AppDbContext context, ILogger<EventsController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<EventsController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventSummaryDto>>> GetEvents(
            [FromQuery] string municipalityId,
            [FromQuery] string? timeframe = null)
        {
            _logger.LogInformation("Attempting to retrieve events for municipality: {MunicipalityId}. Timeframe: {Timeframe}", municipalityId, timeframe ?? "all");

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetEvents failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var query = _context.PoisEvents
                .Include(e => e.OrganizerTaxCodeNavigation)
                .AsNoTracking()
                .Where(e => e.OrganizerTaxCodeNavigation != null && e.OrganizerTaxCodeNavigation.MunicipalityId == municipalityId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(timeframe))
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);

                if (timeframe.Equals(Consts.TimeframeUpcoming, StringComparison.OrdinalIgnoreCase))
                    query = query.Where(e => e.StartDate >= today || e.EndDate >= today);
                else if (timeframe.Equals(Consts.TimeframePast, StringComparison.OrdinalIgnoreCase))
                    query = query.Where(e => e.EndDate < today || (e.EndDate == null && e.StartDate < today));
                else
                {
                    _logger.LogWarning("GetEvents failed: Invalid timeframe provided ({Timeframe}).", timeframe);
                    return BadRequest(new { message = Consts.InvalidTimeframe });
                }
            }

            var events = await query
                .OrderBy(e => e.StartDate)
                .ProjectTo<EventSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} events for municipality: {MunicipalityId}", events.Count, municipalityId);

            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDetailDto>> GetEventDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for event ID: {EventId}", id);

            var eventDetail = await _context.PoisEvents
                .AsNoTracking()
                .Where(e => e.Id == id)
                .ProjectTo<EventDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (eventDetail == null)
            {
                _logger.LogWarning("GetEventDetail failed: Event with ID {EventId} not found.", id);
                return NotFound(new { message = Consts.EventNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for event ID: {EventId}", id);

            return Ok(eventDetail);
        }
    }
}
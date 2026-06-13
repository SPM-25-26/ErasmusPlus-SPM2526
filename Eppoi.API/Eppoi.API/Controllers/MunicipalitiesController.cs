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
    public class MunicipalitiesController(AppDbContext context, ILogger<MunicipalitiesController> logger, IMapper mapper) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<MunicipalitiesController> _logger = logger;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MunicipalitySummaryDto>>> GetMunicipalities()
        {
            _logger.LogInformation("Attempting to retrieve all municipalities.");

            var municipalities = await _context.Municipalities
                .AsNoTracking()
                .OrderBy(m => m.Name)
                .ProjectTo<MunicipalitySummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} municipalities.", municipalities.Count);

            return Ok(municipalities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MunicipalityDetailDto>> GetMunicipalityDetail(string id)
        {
            _logger.LogInformation("Attempting to retrieve details for municipality ID: {MunicipalityId}", id);

            var municipality = await _context.Municipalities
                .AsNoTracking()
                .Where(m => m.Id == id)
                .ProjectTo<MunicipalityDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (municipality == null)
            {
                _logger.LogWarning("GetMunicipalityDetail failed: Municipality with ID {MunicipalityId} not found.", id);
                return NotFound(new { message = Consts.MunicipalityNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for municipality ID: {MunicipalityId}", id);

            return Ok(municipality);
        }
    }
}
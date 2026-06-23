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
    public class OrganizationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrganizationsController> _logger;
        private readonly IMapper _mapper;

        public OrganizationsController(AppDbContext context, ILogger<OrganizationsController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationSummaryDto>>> GetOrganizations(
            [FromQuery] string municipalityId,
            [FromQuery] string? type = null)
        {
            _logger.LogInformation("Attempting to retrieve organizations for municipality: {MunicipalityId}", municipalityId);

            if (string.IsNullOrWhiteSpace(municipalityId))
            {
                _logger.LogWarning("GetOrganizations failed: Municipality ID was not provided.");
                return BadRequest(new { message = Consts.MunicipalityIdRequired });
            }

            var query = _context.Organizations
                .AsNoTracking()
                .Where(o => o.MunicipalityId == municipalityId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(type))
            {
                query = query.Where(o => o.Type != null && o.Type.ToLower() == type.ToLower());
            }

            var organizations = await query
                .OrderBy(o => o.LegalName)
                .ProjectTo<OrganizationSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} organizations for municipality: {MunicipalityId}", organizations.Count, municipalityId);

            return Ok(organizations);
        }

        [HttpGet("{taxCode}")]
        public async Task<ActionResult<OrganizationDetailDto>> GetOrganizationDetail(string taxCode)
        {
            _logger.LogInformation("Attempting to retrieve details for organization with TaxCode: {TaxCode}", taxCode);

            var organizationDetail = await _context.Organizations
                .AsNoTracking()
                .Where(o => o.TaxCode == taxCode)
                .ProjectTo<OrganizationDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (organizationDetail == null)
            {
                _logger.LogWarning("GetOrganizationDetail failed: Organization with TaxCode {TaxCode} not found.", taxCode);
                return NotFound(new { message = Consts.OrganizationNotFound });
            }

            _logger.LogInformation("Successfully retrieved details for organization with TaxCode: {TaxCode}", taxCode);

            return Ok(organizationDetail);
        }
    }
}
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
    public class ArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ArticlesController> _logger;
        private readonly IMapper _mapper; 

        public ArticlesController(AppDbContext context, ILogger<ArticlesController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleSummaryDto>>> GetArticles([FromQuery] string municipalityId)
        {
            if (string.IsNullOrWhiteSpace(municipalityId))
                return BadRequest(new { message = Consts.MunicipalityIdRequired });

            var articles = await _context.Articles
                .AsNoTracking()
                .Where(a => a.MunicipalityId == municipalityId)
                .OrderByDescending(a => a.CreatedAt)
                .ProjectTo<ArticleSummaryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDetailDto>> GetArticleDetail(string id)
        {
            var articleDto = await _context.Articles
                .AsNoTracking()
                .Where(a => a.Id == id)
                .ProjectTo<ArticleDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (articleDto == null)
                return NotFound(new { message = Consts.ArticleNotFound });

            articleDto.Paragraphs = [.. articleDto.Paragraphs.OrderBy(p => p.Position ?? int.MaxValue)];

            return Ok(articleDto);
        }
    }
}
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eppoi.API.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class UserPreferencesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserPreferencesController> _logger;
        private readonly IMapper _mapper;

        public UserPreferencesController(AppDbContext context, ILogger<UserPreferencesController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet("getMyPreferences")]
        public async Task<ActionResult<IEnumerable<UserPreferenceDto>>> GetMyPreferences()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                _logger.LogWarning("GetMyPreferences failed: Unable to parse UserId from token.");
                return Unauthorized(new { message = "Unauthorized access." });
            }

            _logger.LogInformation("Attempting to retrieve preferences for user: {UserId}", userId);

            var preferences = await _context.UserPreference
                .AsNoTracking()
                .Where(up => up.UserId == userId)
                .ProjectTo<UserPreferenceDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(preferences);
        }

        [HttpPost("saveMyPreferences")]
        public async Task<ActionResult> SaveMyPreferences([FromBody] SavePreferencesRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                _logger.LogWarning("SaveMyPreferences failed: Unable to parse UserId from token.");
                return Unauthorized(new { message = "Unauthorized access." });
            }

            _logger.LogInformation("Saving {Count} preferences for user: {UserId}", request.Preferences.Count, userId);

            var existingPreferences = await _context.UserPreference
                .Where(up => up.UserId == userId)
                .ToListAsync();

            if (existingPreferences.Count != 0)
                _context.UserPreference.RemoveRange(existingPreferences);

            var newPreferences = _mapper.Map<List<UserPreference>>(request.Preferences);

            foreach (var pref in newPreferences)
            {
                pref.Id = Guid.NewGuid();
                pref.UserId = userId; 
            }

            _context.UserPreference.AddRange(newPreferences);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Preferences successfully saved for user: {UserId}", userId);

            return Ok(new { message = Consts.PreferencesSaved });
        }

        [HttpGet("discover")]
        public async Task<ActionResult<IEnumerable<RecommendedItemDto>>> GetPersonalizedFeed(
            [FromQuery] string municipalityId,
            [FromQuery] double? userLat = null,  
            [FromQuery] double? userLong = null,
            [FromQuery] string? category = null)
        {
            if (string.IsNullOrWhiteSpace(municipalityId))
                return BadRequest(new { message = Consts.MunicipalityIdRequired });

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Unauthorized access." });

            _logger.LogInformation("Generating feed for User: {UserId}. Target Municipality: {MunicipalityId}", userId, municipalityId);

            var userPrefs = await _context.UserPreference
                .AsNoTracking()
                .Where(up => up.UserId == userId)
                .ToListAsync();

            var prefsDict = userPrefs
                .GroupBy(p => p.Category.ToLower())
                .ToDictionary(g => g.Key, g => g.Max(p => p.Weight));

            var rawCandidates = await RetrieveCandidatesAsync(targetMunicipalityId: municipalityId, categoryFilter: category);
            var recommendedItems = TranslateAndScoreCandidates(rawCandidates, prefsDict, userLat, userLong);

            if (recommendedItems.Count < Consts.MinFeedItems)
            {
                int missingCount = Consts.MinFeedItems - recommendedItems.Count;
                _logger.LogInformation("Fallback triggered: Found only {Count} items. Fetching {Missing} more from other areas.", recommendedItems.Count, missingCount);

                var fallbackRaw = await RetrieveCandidatesAsync(targetMunicipalityId: null, excludeMunicipalityId: municipalityId, categoryFilter: category, limit: 150);

                var fallbackItems = TranslateAndScoreCandidates(fallbackRaw, prefsDict, userLat, userLong);

                var topFallbackItems = fallbackItems
                    .OrderByDescending(i => i.MatchScore)
                    .Take(missingCount);

                recommendedItems.AddRange(topFallbackItems);
            }

            var rankedFeed = recommendedItems
                .OrderByDescending(i => i.MatchScore)
                .Take(50)
                .ToList();

            return Ok(rankedFeed);
        }

        private async Task<List<RawPoiCandidate>> RetrieveCandidatesAsync(
            string? targetMunicipalityId = null, 
            string? excludeMunicipalityId = null,
            string? categoryFilter = null,
            int? limit = null)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var query = _context.Pois.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(targetMunicipalityId))
                query = query.Where(p => p.MunicipalityId == targetMunicipalityId);

            if (!string.IsNullOrWhiteSpace(excludeMunicipalityId))
                query = query.Where(p => p.MunicipalityId != excludeMunicipalityId);

            var projectedQuery = query
                .Where(p => p.PoisEvent == null || p.PoisEvent.EndDate >= today || (p.PoisEvent.EndDate == null && p.PoisEvent.StartDate >= today))
                .Select(p => new RawPoiCandidate
                {
                    Id = p.Id,
                    ImagePath = p.PrimaryImagePath,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,

                    EntityType = p.PoisEvent != null ? "Event" :
                                 p.PoisArtCultureNature != null ? "ArtCulture" :
                                 p.PoisEatAndDrink != null ? "EatDrink" :
                                 p.PoisShopping != null ? "Shopping" :
                                 p.PoisEntertainmentLeisure != null ? "Entertainment" :
                                 p.PoisSleep != null ? "Sleep" : null,

                    Title = p.PoisEvent != null ? p.PoisEvent.Title : p.OfficialName,
                    EventDate = p.PoisEvent != null ? p.PoisEvent.StartDate : null,

                    Category = p.PoisEvent != null ? p.PoisEvent.Typology :
                               p.PoisArtCultureNature != null ? (p.PoisArtCultureNature.ArtCultureNatureType ?? p.PoisArtCultureNature.Type) :
                               p.PoisEatAndDrink != null ? p.PoisEatAndDrink.Type :
                               p.PoisShopping != null ? p.PoisShopping.PoiCategory :
                               p.PoisEntertainmentLeisure != null ? p.PoisEntertainmentLeisure.Category :
                               p.PoisSleep != null ? p.PoisSleep.Typology : null
                })
                .Where(raw => raw.EntityType != null);

            if (!string.IsNullOrWhiteSpace(categoryFilter))
            {
                var lowerFilter = categoryFilter.ToLower();
                projectedQuery = projectedQuery.Where(raw =>
                    (raw.EntityType != null && raw.EntityType.ToLower() == lowerFilter) ||
                    (raw.Category != null && raw.Category.ToLower() == lowerFilter));
            }

            if (limit.HasValue)
                projectedQuery = projectedQuery.Take(limit.Value);

            return await projectedQuery.ToListAsync();
        }

        private List<RecommendedItemDto> TranslateAndScoreCandidates(
            List<RawPoiCandidate> rawCandidates,
            Dictionary<string, double> prefsDict,
            double? userLat,
            double? userLong)
        {
            var recommendedItems = new List<RecommendedItemDto>();
            var random = new Random();

            foreach (var raw in rawCandidates)
            {
                var item = new RecommendedItemDto
                {
                    Id = raw.Id,
                    EntityType = raw.EntityType!,
                    Title = raw.Title ?? "Sconosciuto",
                    Subtitle = raw.EntityType == "Event" && raw.EventDate.HasValue ? raw.EventDate.Value.ToString() : raw.Address,
                    Category = raw.Category,
                    ImagePath = raw.ImagePath,
                    MatchScore = random.NextDouble() * 0.1
                };

                if (prefsDict.TryGetValue(item.EntityType.ToLower(), out double typeWeight))
                    item.MatchScore += typeWeight;

                if (!string.IsNullOrWhiteSpace(item.Category) && prefsDict.TryGetValue(item.Category.ToLower(), out double categoryWeight))
                    item.MatchScore += (categoryWeight * 1.5);

                if (userLat.HasValue && userLong.HasValue && raw.Latitude.HasValue && raw.Longitude.HasValue)
                {
                    item.DistanceInKm = CalculateHaversineDistance(userLat.Value, userLong.Value, raw.Latitude.Value, raw.Longitude.Value);

                    if (item.DistanceInKm <= 1.0)
                        item.MatchScore += 1.5;
                    else if (item.DistanceInKm <= 5.0)
                        item.MatchScore += 1.0;
                    else if (item.DistanceInKm <= 15.0)
                        item.MatchScore += 0.5;
                }

                recommendedItems.Add(item);
            }

            return recommendedItems;
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; 
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c; 
        }

        private static double ToRadians(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        private class RawPoiCandidate
        {
            public string Id { get; set; } = string.Empty;
            public string? EntityType { get; set; }
            public string? Title { get; set; }
            public string? Address { get; set; }
            public DateOnly? EventDate { get; set; }
            public string? Category { get; set; }
            public string? ImagePath { get; set; }
            public double? Latitude { get; set; }
            public double? Longitude { get; set; }
        }
    }
}
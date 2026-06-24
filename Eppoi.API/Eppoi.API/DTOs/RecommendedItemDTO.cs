namespace Eppoi.API.DTOs
{
    public class RecommendedItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? ImagePath { get; set; }

        public string EntityType { get; set; } = string.Empty;
        public string? Category { get; set; }
        public double MatchScore { get; set; }
        public double? DistanceInKm { get; set; }
    }
}
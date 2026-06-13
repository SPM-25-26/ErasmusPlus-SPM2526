namespace Eppoi.API.DTOs
{
    public class ShoppingSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? PoiCategory { get; set; }
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
    }

    public class ShoppingDetailDto : ShoppingSummaryDto
    {
        public string? Description { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Website { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string>? Gallery { get; set; }

        public List<TypicalProductDto> TypicalProducts { get; set; } = new();
        public OpeningHourDto? OpeningHours { get; set; }
    }
}
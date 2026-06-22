namespace Eppoi.API.DTOs
{
    public class SleepSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? Typology { get; set; } 
        public string? Classification { get; set; }
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
    }

    public class SleepDetailDto : SleepSummaryDto
    {
        public string? Description { get; set; }
        public string? ShortAddress { get; set; }
        public List<string>? RoomTypologies { get; set; } 
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Website { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string>? Gallery { get; set; }
        public List<string>? VirtualTours { get; set; }

        public OpeningHourDto? OpeningHours { get; set; }
        public List<OfferDto> Offers { get; set; } = new();
    }
}
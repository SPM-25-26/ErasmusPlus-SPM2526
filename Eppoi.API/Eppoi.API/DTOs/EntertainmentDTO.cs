namespace Eppoi.API.DTOs
{
    public class EntertainmentSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? Category { get; set; } 
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
    }

    public class EntertainmentDetailDto : EntertainmentSummaryDto
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
        public List<string>? VirtualTours { get; set; }
    }
}
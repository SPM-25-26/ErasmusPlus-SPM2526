namespace Eppoi.API.DTOs
{
    public class MunicipalitySummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? NameAndProvince { get; set; }
        public string? LogoPath { get; set; }
    }

    public class MunicipalityDetailDto : MunicipalitySummaryDto
    {
        public string LegalName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Website { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string>? HomeImages { get; set; }
        public string? PanoramaPath { get; set; }
        public List<string>? VirtualTourUrls { get; set; }
    }
}
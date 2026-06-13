namespace Eppoi.API.DTOs
{
    public class ArtCultureSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? Type { get; set; }
        public string? ArtCultureNatureType { get; set; } 
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
    }

    public class ArtCultureDetailDto : ArtCultureSummaryDto
    {
        public string? SubjectDiscipline { get; set; }
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

        public SiteDto? Site { get; set; }
        public List<CatalogueDto> Catalogues { get; set; } = new();
        public List<CreativeWorkDto> CreativeWorks { get; set; } = new();
        public List<CulturalProjectDto> CulturalProjects { get; set; } = new();
    }

    public class SiteDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? ImagePath { get; set; }
        public string? Category { get; set; }
    }

    public class CatalogueDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? Description { get; set; }
    }

    public class CreativeWorkDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Type { get; set; }
        public string? Url { get; set; }
    }

    public class CulturalProjectDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Url { get; set; }
    }
}
namespace Eppoi.API.DTOs
{
    public class OrganizationSummaryDto
    {
        public string TaxCode { get; set; } = string.Empty;
        public string? LegalName { get; set; }
        public string? Type { get; set; } 
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
    }

    public class OrganizationDetailDto : OrganizationSummaryDto
    {
        public string? Description { get; set; }
        public string? MainFunction { get; set; }
        public string? FoundationDate { get; set; }
        public string? LegalStatus { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Website { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string>? Gallery { get; set; }
    }
}
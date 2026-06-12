namespace Eppoi.API.DTOs
{
    public class EventSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Typology { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? OrganizerName { get; set; }
    }

    public class EventDetailDto : EventSummaryDto
    {
        public string? Audience { get; set; }
        public OrganizerDto? Organizer { get; set; }
        public List<OfferDto> Offers { get; set; } = new();
    }

    public class OrganizerDto
    {
        public string TaxCode { get; set; } = string.Empty;
        public string? LegalName { get; set; }
        public string? Type { get; set; }
        public string? PrimaryImagePath { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Website { get; set; }
    }

    public class OfferDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PriceSpecificationCurrencyValue { get; set; }
        public string? Currency { get; set; }
        public string? TicketDescription { get; set; }
        public DateOnly? ValidityStartDate { get; set; }
        public DateOnly? ValidityEndDate { get; set; }
    }
}
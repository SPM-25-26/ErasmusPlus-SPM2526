namespace Eppoi.API.DTOs
{
    public class EatAndDrinkSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? OfficialName { get; set; }
        public string? Type { get; set; } // es. Ristorante, Bar, Pub
        public string? PrimaryImagePath { get; set; }
        public string? Address { get; set; }
        public List<string>? DietaryNeeds { get; set; } // es. Vegano, Senza Glutine
    }

    public class EatAndDrinkDetailDto : EatAndDrinkSummaryDto
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

    public class TypicalProductDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class OpeningHourDto
    {
        public string? Opens { get; set; }
        public string? Closes { get; set; }
        public string? Description { get; set; }
        public int? Day { get; set; }
    }
}
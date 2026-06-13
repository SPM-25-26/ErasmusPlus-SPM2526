namespace Eppoi.API.DTOs
{
    public class RouteSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? ShortName { get; set; }
        public string? ImagePath { get; set; }
        public string? PathTheme { get; set; }
        public string? TravellingMethod { get; set; }
        public string? Duration { get; set; }
        public string? RouteLength { get; set; }
        public int? NumberOfStages { get; set; }
    }

    public class RouteDetailDto : RouteSummaryDto
    {
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? SecurityLevel { get; set; }
        public List<string>? Gallery { get; set; }
        public List<string>? VirtualTours { get; set; }
        public List<string>? BestWhen { get; set; }

        public double? StartPointLat { get; set; }
        public double? StartPointLong { get; set; }
        public string? StartPointAddress { get; set; }

        public string? OrgWebsite { get; set; }
        public string? OrgEmail { get; set; }
        public string? OrgFacebook { get; set; }
        public string? OrgInstagram { get; set; }
        public string? OrgTelephone { get; set; }

        public List<RouteStageDto> RouteStages { get; set; } = [];
    }

    public class RouteStageDto
    {
        public string Id { get; set; } = string.Empty;
        public int? Number { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? Signposting { get; set; }
        public string? SupportService { get; set; }

        public string? PoiId { get; set; }
        public string? PoiName { get; set; } 
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("routes")]
[Index("MunicipalityId", Name = "IX_routes_municipalityId")]
public partial class Route
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("imagePath", TypeName = "character varying")]
    public string? ImagePath { get; set; }

    [Column("routeNumber", TypeName = "character varying")]
    public string? RouteNumber { get; set; }

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("pathTheme", TypeName = "character varying")]
    public string? PathTheme { get; set; }

    [Column("travellingMethod", TypeName = "character varying")]
    public string? TravellingMethod { get; set; }

    [Column("shortName", TypeName = "character varying")]
    public string? ShortName { get; set; }

    [Column("orgWebsite", TypeName = "character varying")]
    public string? OrgWebsite { get; set; }

    [Column("orgEmail", TypeName = "character varying")]
    public string? OrgEmail { get; set; }

    [Column("orgFacebook", TypeName = "character varying")]
    public string? OrgFacebook { get; set; }

    [Column("orgInstagram", TypeName = "character varying")]
    public string? OrgInstagram { get; set; }

    [Column("orgTelephone", TypeName = "character varying")]
    public string? OrgTelephone { get; set; }

    [Column("website", TypeName = "character varying")]
    public string? Website { get; set; }

    [Column("securityLevel", TypeName = "character varying")]
    public string? SecurityLevel { get; set; }

    public int? NumberOfStages { get; set; }

    public double? QuantifiedPathwayPaving { get; set; }

    [Column("duration", TypeName = "character varying")]
    public string? Duration { get; set; }

    [Column("routeLength", TypeName = "character varying")]
    public string? RouteLength { get; set; }

    [Column("gallery", TypeName = "character varying[]")]
    public List<string>? Gallery { get; set; }

    [Column("virtualTours", TypeName = "character varying[]")]
    public List<string>? VirtualTours { get; set; }

    [Column("startDate", TypeName = "character varying")]
    public string? StartDate { get; set; }

    [Column("endDate", TypeName = "character varying")]
    public string? EndDate { get; set; }

    public double? StartPointLat { get; set; }

    public double? StartPointLong { get; set; }

    [Column("startPointAddress", TypeName = "character varying")]
    public string? StartPointAddress { get; set; }

    [Column("bestWhen", TypeName = "character varying[]")]
    public List<string>? BestWhen { get; set; }

    [Column("municipalityId", TypeName = "character varying")]
    public string? MunicipalityId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("MunicipalityId")]
    [InverseProperty("Routes")]
    public virtual Municipality? Municipality { get; set; }

    [InverseProperty("Route")]
    public virtual ICollection<RouteStage> RouteStages { get; set; } = new List<RouteStage>();
}

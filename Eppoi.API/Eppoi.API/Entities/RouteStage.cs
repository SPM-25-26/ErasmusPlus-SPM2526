using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("route_stages")]
[Index("PoiId", Name = "IX_route_stages_poiId")]
[Index("RouteId", Name = "IX_route_stages_routeId")]
public partial class RouteStage
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("category", TypeName = "character varying")]
    public string? Category { get; set; }

    [Column("poiId", TypeName = "character varying")]
    public string? PoiId { get; set; }

    [Column("signposting", TypeName = "character varying")]
    public string? Signposting { get; set; }

    [Column("supportService", TypeName = "character varying")]
    public string? SupportService { get; set; }

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("number")]
    public int? Number { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [Column("routeId", TypeName = "character varying")]
    public string RouteId { get; set; } = null!;

    [ForeignKey("PoiId")]
    [InverseProperty("RouteStages")]
    public virtual Poi? Poi { get; set; }

    [ForeignKey("RouteId")]
    [InverseProperty("RouteStages")]
    public virtual Route Route { get; set; } = null!;
}

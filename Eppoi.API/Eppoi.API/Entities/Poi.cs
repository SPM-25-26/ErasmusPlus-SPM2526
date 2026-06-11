using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois")]
[Index("MunicipalityId", Name = "IX_pois_municipalityId")]
[Index("OwnerTaxCode", Name = "IX_pois_ownerTaxCode")]
public partial class Poi
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("officialName", TypeName = "character varying")]
    public string? OfficialName { get; set; }

    [Column("primaryImagePath", TypeName = "character varying")]
    public string? PrimaryImagePath { get; set; }

    [Column("address", TypeName = "character varying")]
    public string? Address { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("email", TypeName = "character varying")]
    public string? Email { get; set; }

    [Column("telephone", TypeName = "character varying")]
    public string? Telephone { get; set; }

    [Column("facebook", TypeName = "character varying")]
    public string? Facebook { get; set; }

    [Column("instagram", TypeName = "character varying")]
    public string? Instagram { get; set; }

    [Column("website", TypeName = "character varying")]
    public string? Website { get; set; }

    [Column("gallery", TypeName = "character varying[]")]
    public List<string>? Gallery { get; set; }

    [Column("virtualTours", TypeName = "character varying[]")]
    public List<string>? VirtualTours { get; set; }

    [Column("latitude")]
    public double? Latitude { get; set; }

    [Column("longitude")]
    public double? Longitude { get; set; }

    [Column("municipalityId", TypeName = "character varying")]
    public string? MunicipalityId { get; set; }

    [Column("ownerTaxCode", TypeName = "character varying")]
    public string? OwnerTaxCode { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("MunicipalityId")]
    [InverseProperty("Pois")]
    public virtual Municipality? Municipality { get; set; }

    [ForeignKey("OwnerTaxCode")]
    [InverseProperty("Pois")]
    public virtual Organization? OwnerTaxCodeNavigation { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisArtCultureNature? PoisArtCultureNature { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisEatAndDrink? PoisEatAndDrink { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisEntertainmentLeisure? PoisEntertainmentLeisure { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisEvent? PoisEvent { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisShopping? PoisShopping { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual PoisSleep? PoisSleep { get; set; }

    [InverseProperty("Poi")]
    public virtual ICollection<RouteStage> RouteStages { get; set; } = new List<RouteStage>();

    [ForeignKey("PoisId")]
    [InverseProperty("Pois")]
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}

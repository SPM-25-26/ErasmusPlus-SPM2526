using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("organizations")]
[Index("MunicipalityId", Name = "IX_organizations_municipalityId")]
public partial class Organization
{
    [Key]
    [Column("taxCode", TypeName = "character varying")]
    public string TaxCode { get; set; } = null!;

    [Column("legalName", TypeName = "character varying")]
    public string? LegalName { get; set; }

    [Column("primaryImagePath", TypeName = "character varying")]
    public string? PrimaryImagePath { get; set; }

    [Column("type", TypeName = "character varying")]
    public string? Type { get; set; }

    [Column("address", TypeName = "character varying")]
    public string? Address { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("mainFunction", TypeName = "character varying")]
    public string? MainFunction { get; set; }

    [Column("foundationDate", TypeName = "character varying")]
    public string? FoundationDate { get; set; }

    [Column("legalStatus", TypeName = "character varying")]
    public string? LegalStatus { get; set; }

    [Column("gallery", TypeName = "character varying[]")]
    public List<string>? Gallery { get; set; }

    [Column("email", TypeName = "character varying")]
    public string? Email { get; set; }

    [Column("telephone", TypeName = "character varying")]
    public string? Telephone { get; set; }

    [Column("website", TypeName = "character varying")]
    public string? Website { get; set; }

    [Column("instagram", TypeName = "character varying")]
    public string? Instagram { get; set; }

    [Column("facebook", TypeName = "character varying")]
    public string? Facebook { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    [Column("offers", TypeName = "character varying[]")]
    public List<string>? Offers { get; set; }

    [Column("events", TypeName = "character varying[]")]
    public List<string>? Events { get; set; }

    [Column("municipalityId", TypeName = "character varying")]
    public string? MunicipalityId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("MunicipalityId")]
    [InverseProperty("Organizations")]
    public virtual Municipality? Municipality { get; set; }

    [InverseProperty("OwnerTaxCodeNavigation")]
    public virtual ICollection<Poi> Pois { get; set; } = new List<Poi>();

    [InverseProperty("OrganizerTaxCodeNavigation")]
    public virtual ICollection<PoisEvent> PoisEvents { get; set; } = new List<PoisEvent>();
}

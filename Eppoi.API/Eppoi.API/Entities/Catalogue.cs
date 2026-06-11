using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("catalogues")]
[Index("ArtCultureNaturePoiId", Name = "IX_catalogues_artCultureNaturePoiId")]
public partial class Catalogue
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("websiteUrl", TypeName = "character varying")]
    public string? WebsiteUrl { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("artCultureNaturePoiId", TypeName = "character varying")]
    public string? ArtCultureNaturePoiId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ArtCultureNaturePoiId")]
    [InverseProperty("Catalogues")]
    public virtual PoisArtCultureNature? ArtCultureNaturePoi { get; set; }
}

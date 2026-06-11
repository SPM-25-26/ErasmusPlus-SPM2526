using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("creative_works")]
[Index("ArtCultureNaturePoiId", Name = "IX_creative_works_artCultureNaturePoiId")]
public partial class CreativeWork
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("type", TypeName = "character varying")]
    public string? Type { get; set; }

    [Column("url", TypeName = "character varying")]
    public string? Url { get; set; }

    [Column("artCultureNaturePoiId", TypeName = "character varying")]
    public string? ArtCultureNaturePoiId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ArtCultureNaturePoiId")]
    [InverseProperty("CreativeWorks")]
    public virtual PoisArtCultureNature? ArtCultureNaturePoi { get; set; }
}

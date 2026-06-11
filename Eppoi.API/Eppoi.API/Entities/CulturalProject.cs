using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("cultural_projects")]
[Index("ArtCultureNaturePoiId", Name = "IX_cultural_projects_artCultureNaturePoiId")]
public partial class CulturalProject
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("url", TypeName = "character varying")]
    public string? Url { get; set; }

    [Column("artCultureNaturePoiId", TypeName = "character varying")]
    public string? ArtCultureNaturePoiId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ArtCultureNaturePoiId")]
    [InverseProperty("CulturalProjects")]
    public virtual PoisArtCultureNature? ArtCultureNaturePoi { get; set; }
}

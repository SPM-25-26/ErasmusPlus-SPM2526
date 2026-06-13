using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_art_culture_nature")]
[Index("SiteId", Name = "IX_pois_art_culture_nature_siteId")]
public partial class PoisArtCultureNature
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("type", TypeName = "character varying")]
    public string? Type { get; set; }

    [Column("artCultureNatureType", TypeName = "character varying")]
    public string? ArtCultureNatureType { get; set; }

    [Column("subjectDiscipline", TypeName = "character varying")]
    public string? SubjectDiscipline { get; set; }

    [Column("siteId", TypeName = "character varying")]
    public string? SiteId { get; set; }

    [InverseProperty("ArtCultureNaturePoi")]
    public virtual ICollection<Catalogue> Catalogues { get; set; } = [];

    [InverseProperty("ArtCultureNaturePoi")]
    public virtual ICollection<CreativeWork> CreativeWorks { get; set; } = [];

    [InverseProperty("ArtCultureNaturePoi")]
    public virtual ICollection<CulturalProject> CulturalProjects { get; set; } = [];

    [ForeignKey("Id")]
    [InverseProperty("PoisArtCultureNature")]
    public virtual Poi IdNavigation { get; set; } = null!;

    [ForeignKey("SiteId")]
    [InverseProperty("PoisArtCultureNatures")]
    public virtual Site? Site { get; set; }
}

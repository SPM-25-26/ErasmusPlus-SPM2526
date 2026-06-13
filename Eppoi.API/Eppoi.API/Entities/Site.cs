using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("sites")]
public partial class Site
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("officialName", TypeName = "character varying")]
    public string? OfficialName { get; set; }

    [Column("imagePath", TypeName = "character varying")]
    public string? ImagePath { get; set; }

    [Column("category", TypeName = "character varying")]
    public string? Category { get; set; }

    [InverseProperty("Site")]
    public virtual ICollection<PoisArtCultureNature> PoisArtCultureNatures { get; set; } = [];
}

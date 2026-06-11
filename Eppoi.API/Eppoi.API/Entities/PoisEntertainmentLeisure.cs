using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_entertainment_leisure")]
public partial class PoisEntertainmentLeisure
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("category", TypeName = "character varying")]
    public string? Category { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("PoisEntertainmentLeisure")]
    public virtual Poi IdNavigation { get; set; } = null!;
}

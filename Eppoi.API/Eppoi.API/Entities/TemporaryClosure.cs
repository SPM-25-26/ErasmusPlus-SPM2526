using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("temporary_closures")]
[Index("TimeIntervalId", Name = "IX_temporary_closures_timeIntervalId")]
public partial class TemporaryClosure
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("reasonForClosure", TypeName = "character varying")]
    public string? ReasonForClosure { get; set; }

    [Column("opens", TypeName = "character varying")]
    public string? Opens { get; set; }

    [Column("closes", TypeName = "character varying")]
    public string? Closes { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("timeIntervalId", TypeName = "character varying")]
    public string? TimeIntervalId { get; set; }

    [Column("day")]
    public int? Day { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("TemporaryClosure")]
    public virtual ICollection<PoisEatAndDrink> PoisEatAndDrinks { get; set; } = new List<PoisEatAndDrink>();

    [InverseProperty("TemporaryClosure")]
    public virtual ICollection<PoisShopping> PoisShoppings { get; set; } = new List<PoisShopping>();

    [InverseProperty("TemporaryClosure")]
    public virtual ICollection<PoisSleep> PoisSleeps { get; set; } = new List<PoisSleep>();

    [InverseProperty("TemporaryClosure")]
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();

    [ForeignKey("TimeIntervalId")]
    [InverseProperty("TemporaryClosures")]
    public virtual TimeInterval? TimeInterval { get; set; }
}

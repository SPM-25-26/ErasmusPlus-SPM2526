using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("opening_hours")]
[Index("TimeIntervalId", Name = "IX_opening_hours_timeIntervalId")]
public partial class OpeningHour
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("opens", TypeName = "character varying")]
    public string? Opens { get; set; }

    [Column("closes", TypeName = "character varying")]
    public string? Closes { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("admissionTypeName")]
    public int? AdmissionTypeName { get; set; }

    [Column("timeIntervalId", TypeName = "character varying")]
    public string? TimeIntervalId { get; set; }

    [Column("day")]
    public int? Day { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("OpeningHours")]
    public virtual ICollection<PoisEatAndDrink> PoisEatAndDrinks { get; set; } = [];

    [InverseProperty("OpeningHours")]
    public virtual ICollection<PoisShopping> PoisShoppings { get; set; } = [];

    [InverseProperty("OpeningHours")]
    public virtual ICollection<PoisSleep> PoisSleeps { get; set; } = [];

    [InverseProperty("OpeningHours")]
    public virtual ICollection<Service> Services { get; set; } = [];

    [ForeignKey("TimeIntervalId")]
    [InverseProperty("OpeningHours")]
    public virtual TimeInterval? TimeInterval { get; set; }
}

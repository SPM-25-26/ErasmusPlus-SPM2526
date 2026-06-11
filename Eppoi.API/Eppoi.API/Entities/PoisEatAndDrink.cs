using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_eat_and_drink")]
[Index("OpeningHoursId", Name = "IX_pois_eat_and_drink_openingHoursId")]
[Index("TemporaryClosureId", Name = "IX_pois_eat_and_drink_temporaryClosureId")]
public partial class PoisEatAndDrink
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("type", TypeName = "character varying")]
    public string? Type { get; set; }

    [Column("dietaryNeeds", TypeName = "character varying[]")]
    public List<string>? DietaryNeeds { get; set; }

    [Column("openingHoursId", TypeName = "character varying")]
    public string? OpeningHoursId { get; set; }

    [Column("temporaryClosureId", TypeName = "character varying")]
    public string? TemporaryClosureId { get; set; }

    [InverseProperty("Poi")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [ForeignKey("Id")]
    [InverseProperty("PoisEatAndDrink")]
    public virtual Poi IdNavigation { get; set; } = null!;

    [ForeignKey("OpeningHoursId")]
    [InverseProperty("PoisEatAndDrinks")]
    public virtual OpeningHour? OpeningHours { get; set; }

    [ForeignKey("TemporaryClosureId")]
    [InverseProperty("PoisEatAndDrinks")]
    public virtual TemporaryClosure? TemporaryClosure { get; set; }

    [ForeignKey("EatAndDrinkPoiId")]
    [InverseProperty("EatAndDrinkPois")]
    public virtual ICollection<TypicalProduct> TypicalProducts { get; set; } = new List<TypicalProduct>();
}

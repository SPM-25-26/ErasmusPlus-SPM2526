using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_shopping")]
[Index("OpeningHoursId", Name = "IX_pois_shopping_openingHoursId")]
[Index("TemporaryClosureId", Name = "IX_pois_shopping_temporaryClosureId")]
public partial class PoisShopping
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("poiCategory", TypeName = "character varying")]
    public string? PoiCategory { get; set; }

    [Column("openingHoursId", TypeName = "character varying")]
    public string? OpeningHoursId { get; set; }

    [Column("temporaryClosureId", TypeName = "character varying")]
    public string? TemporaryClosureId { get; set; }

    [InverseProperty("PoiNavigation")]
    public virtual ICollection<Booking> Bookings { get; set; } = [];

    [ForeignKey("Id")]
    [InverseProperty("PoisShopping")]
    public virtual Poi IdNavigation { get; set; } = null!;

    [ForeignKey("OpeningHoursId")]
    [InverseProperty("PoisShoppings")]
    public virtual OpeningHour? OpeningHours { get; set; }

    [ForeignKey("TemporaryClosureId")]
    [InverseProperty("PoisShoppings")]
    public virtual TemporaryClosure? TemporaryClosure { get; set; }

    [ForeignKey("ShoppingPoiId")]
    [InverseProperty("ShoppingPois")]
    public virtual ICollection<TypicalProduct> TypicalProducts { get; set; } = [];
}

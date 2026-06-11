using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("bookings")]
[Index("PoiId", Name = "IX_bookings_poiId")]
[Index("ServicePoiId", Name = "IX_bookings_servicePoiId")]
[Index("TimeIntervalId", Name = "IX_bookings_timeIntervalId")]
public partial class Booking
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("timeIntervalId", TypeName = "character varying")]
    public string? TimeIntervalId { get; set; }

    [Column("poiId", TypeName = "character varying")]
    public string? PoiId { get; set; }

    [Column("servicePoiId", TypeName = "character varying")]
    public string? ServicePoiId { get; set; }

    [Column("name")]
    public int? Name { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("PoiId")]
    [InverseProperty("Bookings")]
    public virtual PoisEatAndDrink? Poi { get; set; }

    [ForeignKey("PoiId")]
    [InverseProperty("Bookings")]
    public virtual PoisSleep? Poi1 { get; set; }

    [ForeignKey("PoiId")]
    [InverseProperty("Bookings")]
    public virtual PoisShopping? PoiNavigation { get; set; }

    [ForeignKey("ServicePoiId")]
    [InverseProperty("Bookings")]
    public virtual Service? ServicePoi { get; set; }

    [ForeignKey("TimeIntervalId")]
    [InverseProperty("Bookings")]
    public virtual TimeInterval? TimeInterval { get; set; }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_sleep")]
[Index("OpeningHoursId", Name = "IX_pois_sleep_openingHoursId")]
[Index("TemporaryClosureId", Name = "IX_pois_sleep_temporaryClosureId")]
public partial class PoisSleep
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("classification", TypeName = "character varying")]
    public string? Classification { get; set; }

    [Column("typology", TypeName = "character varying")]
    public string? Typology { get; set; }

    [Column("roomTypologies", TypeName = "character varying[]")]
    public List<string>? RoomTypologies { get; set; }

    [Column("shortAddress", TypeName = "character varying")]
    public string? ShortAddress { get; set; }

    [Column("openingHoursId", TypeName = "character varying")]
    public string? OpeningHoursId { get; set; }

    [Column("temporaryClosureId", TypeName = "character varying")]
    public string? TemporaryClosureId { get; set; }

    [InverseProperty("Poi1")]
    public virtual ICollection<Booking> Bookings { get; set; } = [];

    [ForeignKey("Id")]
    [InverseProperty("PoisSleep")]
    public virtual Poi IdNavigation { get; set; } = null!;

    [InverseProperty("SleepPoi")]
    public virtual ICollection<Offer> Offers { get; set; } = [];

    [ForeignKey("OpeningHoursId")]
    [InverseProperty("PoisSleeps")]
    public virtual OpeningHour? OpeningHours { get; set; }

    [ForeignKey("TemporaryClosureId")]
    [InverseProperty("PoisSleeps")]
    public virtual TemporaryClosure? TemporaryClosure { get; set; }
}

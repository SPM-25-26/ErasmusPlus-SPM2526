using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("time_intervals")]
public partial class TimeInterval
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("dateValue", TypeName = "character varying")]
    public string? DateValue { get; set; }

    [Column("startDate", TypeName = "character varying")]
    public string? StartDate { get; set; }

    [Column("endDate", TypeName = "character varying")]
    public string? EndDate { get; set; }

    [InverseProperty("TimeInterval")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [InverseProperty("TimeInterval")]
    public virtual ICollection<OpeningHour> OpeningHours { get; set; } = new List<OpeningHour>();

    [InverseProperty("TimeInterval")]
    public virtual ICollection<TemporaryClosure> TemporaryClosures { get; set; } = new List<TemporaryClosure>();
}

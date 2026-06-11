using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("pois_events")]
[Index("OrganizerTaxCode", Name = "IX_pois_events_organizerTaxCode")]
public partial class PoisEvent
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("title", TypeName = "character varying")]
    public string? Title { get; set; }

    [Column("typology", TypeName = "character varying")]
    public string? Typology { get; set; }

    [Column("audience", TypeName = "character varying")]
    public string? Audience { get; set; }

    [Column("startDate")]
    public DateOnly? StartDate { get; set; }

    [Column("endDate")]
    public DateOnly? EndDate { get; set; }

    [Column("organizerTaxCode", TypeName = "character varying")]
    public string? OrganizerTaxCode { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("PoisEvent")]
    public virtual Poi IdNavigation { get; set; } = null!;

    [InverseProperty("EventPoi")]
    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    [ForeignKey("OrganizerTaxCode")]
    [InverseProperty("PoisEvents")]
    public virtual Organization? OrganizerTaxCodeNavigation { get; set; }
}

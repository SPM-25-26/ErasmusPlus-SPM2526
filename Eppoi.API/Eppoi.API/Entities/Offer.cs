using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("offers")]
[Index("EventPoiId", Name = "IX_offers_eventPoiId")]
[Index("SleepPoiId", Name = "IX_offers_sleepPoiId")]
public partial class Offer
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("priceSpecificationCurrencyValue", TypeName = "character varying")]
    public string? PriceSpecificationCurrencyValue { get; set; }

    [Column("currency", TypeName = "character varying")]
    public string? Currency { get; set; }

    [Column("validityDescription", TypeName = "character varying")]
    public string? ValidityDescription { get; set; }

    [Column("validityStartDate")]
    public DateOnly? ValidityStartDate { get; set; }

    [Column("validityEndDate")]
    public DateOnly? ValidityEndDate { get; set; }

    [Column("userTypeName", TypeName = "character varying")]
    public string? UserTypeName { get; set; }

    [Column("userTypeDescription", TypeName = "character varying")]
    public string? UserTypeDescription { get; set; }

    [Column("ticketDescription", TypeName = "character varying")]
    public string? TicketDescription { get; set; }

    [Column("eventPoiId", TypeName = "character varying")]
    public string? EventPoiId { get; set; }

    [Column("sleepPoiId", TypeName = "character varying")]
    public string? SleepPoiId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("EventPoiId")]
    [InverseProperty("Offers")]
    public virtual PoisEvent? EventPoi { get; set; }

    [ForeignKey("SleepPoiId")]
    [InverseProperty("Offers")]
    public virtual PoisSleep? SleepPoi { get; set; }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("services")]
[Index("MunicipalityId", Name = "IX_services_municipalityId")]
[Index("OpeningHoursId", Name = "IX_services_openingHoursId")]
[Index("TemporaryClosureId", Name = "IX_services_temporaryClosureId")]
public partial class Service
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("address", TypeName = "character varying")]
    public string? Address { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    public int? SpacesForDisabled { get; set; }

    public int? PayingParkingSpaces { get; set; }

    public int? AvailableParkingSpaces { get; set; }

    public int? PostiAutoVenduti { get; set; }

    public int? TotalNumberOfCarSpaces { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    [Column("typology", TypeName = "character varying")]
    public string? Typology { get; set; }

    [Column("primaryImage", TypeName = "character varying")]
    public string? PrimaryImage { get; set; }

    [Column("gallery", TypeName = "character varying[]")]
    public List<string>? Gallery { get; set; }

    [Column("email", TypeName = "character varying")]
    public string? Email { get; set; }

    [Column("telephone", TypeName = "character varying")]
    public string? Telephone { get; set; }

    [Column("website", TypeName = "character varying")]
    public string? Website { get; set; }

    [Column("instagram", TypeName = "character varying")]
    public string? Instagram { get; set; }

    [Column("facebook", TypeName = "character varying")]
    public string? Facebook { get; set; }

    [Column("price", TypeName = "character varying")]
    public string? Price { get; set; }

    [Column("reservationUrl", TypeName = "character varying")]
    public string? ReservationUrl { get; set; }

    [Column("openingHoursId", TypeName = "character varying")]
    public string? OpeningHoursId { get; set; }

    [Column("temporaryClosureId", TypeName = "character varying")]
    public string? TemporaryClosureId { get; set; }

    [Column("locations", TypeName = "character varying")]
    public string? Locations { get; set; }

    [Column("municipalityId", TypeName = "character varying")]
    public string? MunicipalityId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("ServicePoi")]
    public virtual ICollection<Booking> Bookings { get; set; } = [];

    [ForeignKey("MunicipalityId")]
    [InverseProperty("Services")]
    public virtual Municipality? Municipality { get; set; }

    [ForeignKey("OpeningHoursId")]
    [InverseProperty("Services")]
    public virtual OpeningHour? OpeningHours { get; set; }

    [ForeignKey("TemporaryClosureId")]
    [InverseProperty("Services")]
    public virtual TemporaryClosure? TemporaryClosure { get; set; }

    [ForeignKey("ServicesId")]
    [InverseProperty("Services")]
    public virtual ICollection<Poi> Pois { get; set; } = [];
}

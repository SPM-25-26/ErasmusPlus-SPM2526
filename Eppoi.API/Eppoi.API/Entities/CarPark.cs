using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("car_parks")]
public partial class CarPark
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("latitude")]
    public double Latitude { get; set; }

    [Column("longitude")]
    public double Longitude { get; set; }

    [Column("address", TypeName = "character varying")]
    public string? Address { get; set; }
}

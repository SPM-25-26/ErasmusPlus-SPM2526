using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("municipalities")]
public partial class Municipality
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name", TypeName = "character varying")]
    public string Name { get; set; } = null!;

    [Column("legalName", TypeName = "character varying")]
    public string LegalName { get; set; } = null!;

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [Column("email", TypeName = "character varying")]
    public string? Email { get; set; }

    [Column("telephone", TypeName = "character varying")]
    public string? Telephone { get; set; }

    [Column("website", TypeName = "character varying")]
    public string? Website { get; set; }

    [Column("facebook", TypeName = "character varying")]
    public string? Facebook { get; set; }

    [Column("instagram", TypeName = "character varying")]
    public string? Instagram { get; set; }

    [Column("latitude")]
    public double? Latitude { get; set; }

    [Column("longitude")]
    public double? Longitude { get; set; }

    [Column("logoPath", TypeName = "character varying")]
    public string? LogoPath { get; set; }

    [Column("homeImages")]
    public List<string>? HomeImages { get; set; }

    [Column("panoramaPath", TypeName = "character varying")]
    public string? PanoramaPath { get; set; }

    public double? PanoramaWidth { get; set; }

    [Column("virtualTourUrls")]
    public List<string>? VirtualTourUrls { get; set; }

    [Column("nameAndProvince", TypeName = "character varying")]
    public string? NameAndProvince { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [Column("baseUrl", TypeName = "character varying")]
    public string? BaseUrl { get; set; }

    [InverseProperty("Municipality")]
    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();

    [InverseProperty("Municipality")]
    public virtual ICollection<Organization> Organizations { get; set; } = new List<Organization>();

    [InverseProperty("Municipality")]
    public virtual ICollection<Poi> Pois { get; set; } = new List<Poi>();

    [InverseProperty("Municipality")]
    public virtual ICollection<Route> Routes { get; set; } = new List<Route>();

    [InverseProperty("Municipality")]
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("articles")]
[Index("MunicipalityId", Name = "IX_articles_municipalityId")]
public partial class Article
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("title", TypeName = "character varying")]
    public string Title { get; set; } = null!;

    [Column("script", TypeName = "character varying")]
    public string? Script { get; set; }

    [Column("region", TypeName = "character varying")]
    public string? Region { get; set; }

    [Column("subtitle", TypeName = "character varying")]
    public string? Subtitle { get; set; }

    [Column("timeToRead", TypeName = "character varying")]
    public string? TimeToRead { get; set; }

    [Column("imagePath", TypeName = "character varying")]
    public string? ImagePath { get; set; }

    [Column("themes", TypeName = "character varying[]")]
    public List<string>? Themes { get; set; }

    [Column("municipalityId", TypeName = "character varying")]
    public string? MunicipalityId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    public string? BaseUrl { get; set; }

    [InverseProperty("Article")]
    public virtual ICollection<ArticleParagraph> ArticleParagraphs { get; set; } = new List<ArticleParagraph>();

    [ForeignKey("MunicipalityId")]
    [InverseProperty("Articles")]
    public virtual Municipality? Municipality { get; set; }
}

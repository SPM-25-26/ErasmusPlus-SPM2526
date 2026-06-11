using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("article_paragraphs")]
[Index("ArticleId", Name = "IX_article_paragraphs_articleId")]
public partial class ArticleParagraph
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("title", TypeName = "character varying")]
    public string? Title { get; set; }

    [Column("script", TypeName = "character varying")]
    public string? Script { get; set; }

    [Column("position")]
    public int? Position { get; set; }

    [Column("subtitle", TypeName = "character varying")]
    public string? Subtitle { get; set; }

    [Column("region", TypeName = "character varying")]
    public string? Region { get; set; }

    [Column("referenceId", TypeName = "character varying")]
    public string? ReferenceId { get; set; }

    [Column("referenceName", TypeName = "character varying")]
    public string? ReferenceName { get; set; }

    [Column("referenceCategory", TypeName = "character varying")]
    public string? ReferenceCategory { get; set; }

    [Column("referenceImagePath", TypeName = "character varying")]
    public string? ReferenceImagePath { get; set; }

    [Column("referenceLongitude")]
    public double? ReferenceLongitude { get; set; }

    [Column("referenceLatitude")]
    public double? ReferenceLatitude { get; set; }

    [Column("articleId", TypeName = "character varying")]
    public string? ArticleId { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ArticleId")]
    [InverseProperty("ArticleParagraphs")]
    public virtual Article? Article { get; set; }
}

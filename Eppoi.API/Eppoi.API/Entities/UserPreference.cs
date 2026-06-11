using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("user_preferences")]
public partial class UserPreference
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("userId")]
    public Guid UserId { get; set; }

    [Column("category", TypeName = "character varying")]
    public string Category { get; set; } = null!;

    [Column("subType", TypeName = "character varying")]
    public string? SubType { get; set; }

    [Column("weight")]
    public double Weight { get; set; }
}

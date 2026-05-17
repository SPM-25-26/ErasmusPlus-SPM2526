using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("users")]
[Index("Username", Name = "User_username_key", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("name", TypeName = "character varying")]
    public string Name { get; set; } = null!;

    [Column("surname", TypeName = "character varying")]
    public string Surname { get; set; } = null!;

    [Column("username", TypeName = "character varying")]
    public string Username { get; set; } = null!;

    [Column("mail", TypeName = "character varying")]
    public string Mail { get; set; } = null!;

    [Column("password", TypeName = "character varying")]
    public string Password { get; set; } = null!;

    [Column("role")]
    public long Role { get; set; }

    [Column("profilePictureUrl", TypeName = "character varying")]
    public string? ProfilePictureUrl { get; set; }

    [Column("verified")]
    public bool Verified { get; set; }

    [Column("created_at", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [Column("hashedEmail", TypeName = "character varying")]
    public string? HashedEmail { get; set; }

    [Column("hasCompletedFirstLogin")]
    public bool? HasCompletedFirstLogin { get; set; }

    [Column("preferredTravelMethod")]
    public string? PreferredTravelMethod { get; set; }

    [Column("preferredTravelStyle")]
    public string? PreferredTravelStyle { get; set; }
}

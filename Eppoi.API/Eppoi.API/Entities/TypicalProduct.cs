using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Entities;

[Table("typical_products")]
public partial class TypicalProduct
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name", TypeName = "character varying")]
    public string? Name { get; set; }

    [Column("description", TypeName = "character varying")]
    public string? Description { get; set; }

    [ForeignKey("TypicalProductsId")]
    [InverseProperty("TypicalProducts")]
    public virtual ICollection<PoisEatAndDrink> EatAndDrinkPois { get; set; } = new List<PoisEatAndDrink>();

    [ForeignKey("TypicalProductsId")]
    [InverseProperty("TypicalProducts")]
    public virtual ICollection<PoisShopping> ShoppingPois { get; set; } = new List<PoisShopping>();
}

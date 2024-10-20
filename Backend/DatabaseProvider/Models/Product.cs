using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Product
{
    public int Id { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public bool IsActive { get; set; }

    public bool IsCustomizable { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<CustomizableProduct> CustomizableProducts { get; set; } = new List<CustomizableProduct>();

    public virtual ICollection<CustomizationOrder> CustomizationOrders { get; set; } = new List<CustomizationOrder>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<ProductTranslation> ProductTranslations { get; set; } = new List<ProductTranslation>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}

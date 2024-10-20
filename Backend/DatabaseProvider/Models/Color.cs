using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Color
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string HexCode { get; set; } = null!;

    public virtual ICollection<CustomizableProduct> CustomizableProducts { get; set; } = new List<CustomizableProduct>();

    public virtual ICollection<CustomizationOrder> CustomizationOrders { get; set; } = new List<CustomizationOrder>();
}

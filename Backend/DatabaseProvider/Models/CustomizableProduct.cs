using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class CustomizableProduct
{
    public int Id { get; set; }

    public int FkProducts { get; set; }

    public int? FkFabricTypes { get; set; }

    public int? FkColors { get; set; }

    public string? SizeOptions { get; set; }

    public string? CustomizationDetails { get; set; }

    public virtual Color? FkColorsNavigation { get; set; }

    public virtual FabricType? FkFabricTypesNavigation { get; set; }

    public virtual Product FkProductsNavigation { get; set; } = null!;
}

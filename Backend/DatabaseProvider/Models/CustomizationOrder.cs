using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class CustomizationOrder
{
    public int Id { get; set; }

    public int FkOrders { get; set; }

    public int FkProducts { get; set; }

    public int? FkFabricTypes { get; set; }

    public int? FkColors { get; set; }

    public string? Size { get; set; }

    public string? AdditionalNotes { get; set; }

    public virtual Color? FkColorsNavigation { get; set; }

    public virtual FabricType? FkFabricTypesNavigation { get; set; }

    public virtual Order FkOrdersNavigation { get; set; } = null!;

    public virtual Product FkProductsNavigation { get; set; } = null!;
}

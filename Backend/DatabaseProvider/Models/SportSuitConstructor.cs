using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SportSuitConstructor
{
    public int Id { get; set; }

    public int FkSweaterConstructor { get; set; }

    public int FkSleeveConstructor { get; set; }

    public int FkSleeveCuffConstructor { get; set; }

    public int FkBeltConstructor { get; set; }

    public int FkPantsConstructor { get; set; }

    public int FkPantsCuffConstructor { get; set; }

    public virtual ICollection<CustomizableProduct> CustomizableProducts { get; set; } = new List<CustomizableProduct>();

    public virtual BeltConstructor FkBeltConstructorNavigation { get; set; } = null!;

    public virtual PantsConstructor FkPantsConstructorNavigation { get; set; } = null!;

    public virtual PantsCuffConstructor FkPantsCuffConstructorNavigation { get; set; } = null!;

    public virtual SleeveConstructor FkSleeveConstructorNavigation { get; set; } = null!;

    public virtual SleeveCuffConstructor FkSleeveCuffConstructorNavigation { get; set; } = null!;

    public virtual SweaterConstructor FkSweaterConstructorNavigation { get; set; } = null!;
}

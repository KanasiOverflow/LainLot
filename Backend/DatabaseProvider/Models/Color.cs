using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Color
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<BeltConstructor> BeltConstructors { get; set; } = new List<BeltConstructor>();

    public virtual ICollection<NeckConstructor> NeckConstructors { get; set; } = new List<NeckConstructor>();

    public virtual ICollection<PantsConstructor> PantsConstructors { get; set; } = new List<PantsConstructor>();

    public virtual ICollection<PantsCuffConstructor> PantsCuffConstructorFkColorsLeftNavigations { get; set; } = new List<PantsCuffConstructor>();

    public virtual ICollection<PantsCuffConstructor> PantsCuffConstructorFkColorsRightNavigations { get; set; } = new List<PantsCuffConstructor>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SleeveConstructor> SleeveConstructors { get; set; } = new List<SleeveConstructor>();

    public virtual ICollection<SleeveCuffConstructor> SleeveCuffConstructorFkColorsLeftNavigations { get; set; } = new List<SleeveCuffConstructor>();

    public virtual ICollection<SleeveCuffConstructor> SleeveCuffConstructorFkColorsRightNavigations { get; set; } = new List<SleeveCuffConstructor>();

    public virtual ICollection<SweaterConstructor> SweaterConstructors { get; set; } = new List<SweaterConstructor>();
}

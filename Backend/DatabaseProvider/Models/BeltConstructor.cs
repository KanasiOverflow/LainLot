using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class BeltConstructor
{
    public int Id { get; set; }

    public int FkBeltConstructor { get; set; }

    public int FkColors { get; set; }

    public virtual BeltConstructor FkBeltConstructorNavigation { get; set; } = null!;

    public virtual Color FkColorsNavigation { get; set; } = null!;

    public virtual ICollection<BeltConstructor> InverseFkBeltConstructorNavigation { get; set; } = new List<BeltConstructor>();

    public virtual ICollection<SportSuitConstructor> SportSuitConstructors { get; set; } = new List<SportSuitConstructor>();
}

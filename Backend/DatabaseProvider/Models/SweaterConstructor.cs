using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SweaterConstructor
{
    public int Id { get; set; }

    public int FkSweaterTypes { get; set; }

    public int FkColors { get; set; }

    public virtual Color FkColorsNavigation { get; set; } = null!;

    public virtual SweaterType FkSweaterTypesNavigation { get; set; } = null!;

    public virtual ICollection<SportSuitConstructor> SportSuitConstructors { get; set; } = new List<SportSuitConstructor>();
}

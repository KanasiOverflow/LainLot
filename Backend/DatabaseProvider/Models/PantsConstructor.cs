using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class PantsConstructor
{
    public int Id { get; set; }

    public int FkPantsTypes { get; set; }

    public int FkColors { get; set; }

    public virtual Color FkColorsNavigation { get; set; } = null!;

    public virtual PantsType FkPantsTypesNavigation { get; set; } = null!;

    public virtual ICollection<SportSuitConstructor> SportSuitConstructors { get; set; } = new List<SportSuitConstructor>();
}

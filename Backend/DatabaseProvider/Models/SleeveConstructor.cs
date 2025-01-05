using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SleeveConstructor
{
    public int Id { get; set; }

    public int FkSleeveTypes { get; set; }

    public int FkColors { get; set; }

    public virtual Color FkColorsNavigation { get; set; } = null!;

    public virtual SleeveType FkSleeveTypesNavigation { get; set; } = null!;

    public virtual ICollection<SportSuitConstructor> SportSuitConstructors { get; set; } = new List<SportSuitConstructor>();
}

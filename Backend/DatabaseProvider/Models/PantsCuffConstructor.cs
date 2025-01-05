using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class PantsCuffConstructor
{
    public int Id { get; set; }

    public int FkPantsCuffTypes { get; set; }

    public int FkColorsLeft { get; set; }

    public int FkColorsRight { get; set; }

    public virtual Color FkColorsLeftNavigation { get; set; } = null!;

    public virtual Color FkColorsRightNavigation { get; set; } = null!;

    public virtual PantsCuffType FkPantsCuffTypesNavigation { get; set; } = null!;

    public virtual ICollection<SportSuitConstructor> SportSuitConstructors { get; set; } = new List<SportSuitConstructor>();
}

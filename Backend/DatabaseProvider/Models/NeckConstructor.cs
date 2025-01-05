using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class NeckConstructor
{
    public int Id { get; set; }

    public int FkNeckTypes { get; set; }

    public int FkColors { get; set; }

    public virtual Color FkColorsNavigation { get; set; } = null!;

    public virtual NeckType FkNeckTypesNavigation { get; set; } = null!;
}

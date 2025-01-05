using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class PantsType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<PantsConstructor> PantsConstructors { get; set; } = new List<PantsConstructor>();
}

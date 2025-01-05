using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class PantsCuffType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<PantsCuffConstructor> PantsCuffConstructors { get; set; } = new List<PantsCuffConstructor>();
}

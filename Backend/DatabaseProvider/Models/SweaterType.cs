using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SweaterType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<SweaterConstructor> SweaterConstructors { get; set; } = new List<SweaterConstructor>();
}

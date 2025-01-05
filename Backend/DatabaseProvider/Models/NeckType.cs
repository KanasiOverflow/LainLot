using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class NeckType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<NeckConstructor> NeckConstructors { get; set; } = new List<NeckConstructor>();
}

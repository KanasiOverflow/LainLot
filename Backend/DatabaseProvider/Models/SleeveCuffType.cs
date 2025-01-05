using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SleeveCuffType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<SleeveCuffConstructor> SleeveCuffConstructors { get; set; } = new List<SleeveCuffConstructor>();
}

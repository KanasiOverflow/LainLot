using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class SleeveType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public virtual ICollection<SleeveConstructor> SleeveConstructors { get; set; } = new List<SleeveConstructor>();
}

using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class BeltType
{
    public int Id { get; set; }

    public byte[] ImageData { get; set; } = null!;
}

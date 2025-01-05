using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Country
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<ShippingAdress> ShippingAdresses { get; set; } = new List<ShippingAdress>();
}

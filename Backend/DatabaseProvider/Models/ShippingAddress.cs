using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class ShippingAddress
{
    public int Id { get; set; }

    public int? FkCountries { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? ZipPostCode { get; set; }

    public string? StateProvince { get; set; }

    public virtual Country? FkCountriesNavigation { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}

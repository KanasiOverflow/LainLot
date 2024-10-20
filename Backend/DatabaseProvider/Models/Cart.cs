using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Cart
{
    public int Id { get; set; }

    public int FkUsers { get; set; }

    public int FkProducts { get; set; }

    public int Quantity { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Product FkProductsNavigation { get; set; } = null!;

    public virtual User FkUsersNavigation { get; set; } = null!;
}

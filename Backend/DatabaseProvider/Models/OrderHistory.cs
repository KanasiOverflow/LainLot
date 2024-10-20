using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class OrderHistory
{
    public int Id { get; set; }

    public int FkOrders { get; set; }

    public int Status { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual Order FkOrdersNavigation { get; set; } = null!;

    public virtual OrderStatus StatusNavigation { get; set; } = null!;
}

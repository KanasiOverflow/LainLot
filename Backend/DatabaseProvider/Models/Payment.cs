using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int FkOrders { get; set; }

    public DateTime PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string Status { get; set; } = null!;

    public virtual Order FkOrdersNavigation { get; set; } = null!;
}

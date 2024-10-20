using System;
using System.Collections.Generic;

namespace DatabaseProvider.Models;

public partial class Order
{
    public int Id { get; set; }

    public int FkUsers { get; set; }

    public int FkOrderStatus { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime OrderDate { get; set; }

    public string ShippingAddress { get; set; } = null!;

    public string? TrackingNumber { get; set; }

    public string? ShippingMethod { get; set; }

    public string? PaymentStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<CustomizationOrder> CustomizationOrders { get; set; } = new List<CustomizationOrder>();

    public virtual OrderStatus FkOrderStatusNavigation { get; set; } = null!;

    public virtual User FkUsersNavigation { get; set; } = null!;

    public virtual ICollection<OrderHistory> OrderHistories { get; set; } = new List<OrderHistory>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

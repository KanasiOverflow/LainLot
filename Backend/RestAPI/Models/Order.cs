namespace RestAPI.Models
{
    public class Order
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
    }
}
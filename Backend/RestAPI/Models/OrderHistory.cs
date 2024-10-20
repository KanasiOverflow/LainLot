namespace RestAPI.Models
{
    public class OrderHistory
    {
        public int Id { get; set; }

        public int FkOrders { get; set; }

        public int Status { get; set; }

        public DateTime ChangedAt { get; set; }
    }
}
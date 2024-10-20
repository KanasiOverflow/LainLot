namespace RestAPI.Models
{
    public class Cart
    {
        public int Id { get; set; }

        public int FkUsers { get; set; }

        public int FkProducts { get; set; }

        public int Quantity { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
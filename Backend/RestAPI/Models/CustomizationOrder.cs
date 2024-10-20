namespace RestAPI.Models
{
    public class CustomizationOrder
    {
        public int Id { get; set; }

        public int FkOrders { get; set; }

        public int FkProducts { get; set; }

        public int? FkFabricTypes { get; set; }

        public int? FkColors { get; set; }

        public string? Size { get; set; }

        public string? AdditionalNotes { get; set; }
    }
}
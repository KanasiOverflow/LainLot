namespace RestAPI.Models
{
    public class CustomizableProduct
    {
        public int Id { get; set; }

        public int FkProducts { get; set; }

        public int? FkFabricTypes { get; set; }

        public int? FkColors { get; set; }

        public string? SizeOptions { get; set; }

        public string? CustomizationDetails { get; set; }
    }
}
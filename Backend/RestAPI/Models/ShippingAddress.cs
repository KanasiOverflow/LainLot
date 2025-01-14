namespace RestAPI.Models
{
    public class ShippingAddress
    {
        public int Id { get; set; }

        public int? FkCountries { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? ZipPostCode { get; set; }

        public string? StateProvince { get; set; }
    }
}
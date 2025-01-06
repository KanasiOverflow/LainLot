namespace RestAPI.Models
{
    public class BeltConstructor
    {
        public int Id { get; set; }

        public int FkBeltConstructor { get; set; }

        public int FkColors { get; set; }
    }
}
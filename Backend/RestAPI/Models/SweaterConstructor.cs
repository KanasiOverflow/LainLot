namespace RestAPI.Models
{
    public class SweaterConstructor
    {
        public int Id { get; set; }

        public int FkSweaterTypes { get; set; }

        public int FkColors { get; set; }
    }
}
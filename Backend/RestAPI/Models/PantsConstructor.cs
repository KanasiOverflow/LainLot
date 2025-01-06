namespace RestAPI.Models
{
    public class PantsConstructor
    {
        public int Id { get; set; }

        public int FkPantsTypes { get; set; }

        public int FkColors { get; set; }
    }
}
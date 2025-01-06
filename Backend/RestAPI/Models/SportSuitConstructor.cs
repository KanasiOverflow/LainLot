namespace RestAPI.Models
{
    public class SportSuitConstructor
    {
        public int Id { get; set; }

        public int FkSweaterConstructor { get; set; }

        public int FkSleeveConstructor { get; set; }

        public int FkSleeveCuffConstructor { get; set; }

        public int FkBeltConstructor { get; set; }

        public int FkPantsConstructor { get; set; }

        public int FkPantsCuffConstructor { get; set; }
    }
}
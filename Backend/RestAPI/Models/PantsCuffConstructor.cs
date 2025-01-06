namespace RestAPI.Models
{
    public class PantsCuffConstructor
    {
        public int Id { get; set; }

        public int FkPantsCuffTypes { get; set; }

        public int FkColorsLeft { get; set; }

        public int FkColorsRight { get; set; }
    }
}
namespace RestAPI.Models
{
    public class SleeveCuffConstructor
    {
        public int Id { get; set; }

        public int FkSleeveCuffTypes { get; set; }

        public int FkColorsLeft { get; set; }

        public int FkColorsRight { get; set; }
    }
}
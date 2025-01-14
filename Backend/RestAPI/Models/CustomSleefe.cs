namespace RestAPI.Models;

public partial class CustomSleefe
{
    public int Id { get; set; }

    public int FkBaseSleeves { get; set; }

    public string? CustomSettings { get; set; }
}
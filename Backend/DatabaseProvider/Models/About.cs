using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class About
{
    public int Id { get; set; }

    public int FkLanguages { get; set; }

    public string Header { get; set; } = null!;

    public string Text { get; set; } = null!;

    [JsonIgnore]
    public virtual Language FkLanguagesNavigation { get; set; } = null!;
}
using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class Language
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Abbreviation { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string DateFormat { get; set; } = null!;

    public string TimeFormat { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<About> Abouts { get; set; } = new List<About>();

    [JsonIgnore]
    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();

    [JsonIgnore]
    public virtual ICollection<PostsTranslation> PostsTranslations { get; set; } = new List<PostsTranslation>();
}
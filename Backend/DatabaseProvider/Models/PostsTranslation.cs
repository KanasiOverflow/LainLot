using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class PostsTranslation
{
    public int Id { get; set; }

    public int FkLanguages { get; set; }

    public int FkPosts { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Text { get; set; } = null!;

    [JsonIgnore]
    public virtual Language FkLanguagesNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Post FkPostsNavigation { get; set; } = null!;
}
namespace RestAPI.Models;

public class PostsTranslation
{
    public int Id { get; set; }

    public int FkLanguages { get; set; }

    public int FkPosts { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Text { get; set; } = null!;
}
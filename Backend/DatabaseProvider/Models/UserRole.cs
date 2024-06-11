using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class UserRole
{
    public int Id { get; set; }

    public int FkAccessLevels { get; set; }

    public string Name { get; set; } = null!;

    [JsonIgnore]
    public virtual AccessLevel FkAccessLevelsNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
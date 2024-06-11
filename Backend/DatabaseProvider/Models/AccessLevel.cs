using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class AccessLevel
{
    public int Id { get; set; }

    public int Level { get; set; }

    public string Description { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
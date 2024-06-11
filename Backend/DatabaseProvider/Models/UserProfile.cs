using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class UserProfile
{
    public int Id { get; set; }

    public int FkUsers { get; set; }

    public string CreateDate { get; set; } = null!;

    public string CreateTime { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? MiddleName { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public int? ZipPostCode { get; set; }

    public string? StateProvince { get; set; }

    public string? Country { get; set; }

    public string? Phone { get; set; }

    public string? Avatar { get; set; }

    [JsonIgnore]
    public virtual User FkUsersNavigation { get; set; } = null!;
}
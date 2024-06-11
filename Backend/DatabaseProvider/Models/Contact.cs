﻿using System.Text.Json.Serialization;

namespace DatabaseProvider.Models;

public partial class Contact
{
    public int Id { get; set; }

    public int FkLanguages { get; set; }

    public string Address { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    [JsonIgnore]
    public virtual Language FkLanguagesNavigation { get; set; } = null!;
}
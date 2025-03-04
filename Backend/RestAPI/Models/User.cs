﻿namespace RestAPI.Models;

public class User
{
    public int Id { get; set; }

    public int FkUserRoles { get; set; }

    public string Login { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int ConfirmEmail { get; set; }

    public string Hash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
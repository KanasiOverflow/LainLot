﻿namespace RestAPI.Models;

public class Post
{
    public int Id { get; set; }

    public DateOnly PostDate { get; set; }

    public TimeOnly PostTime { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Text { get; set; } = null!;

    public string? Tags { get; set; }

    public string? Photo { get; set; }

    public int VisitCount { get; set; }
}
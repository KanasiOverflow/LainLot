using Config;
using DatabaseProvider.Enums;
using Microsoft.EntityFrameworkCore;

namespace DatabaseProvider.Models;

public partial class LainLotContext : DbContext
{
    /// <summary>
    /// 1. cd Backend/DatabaseProvider
    /// 2. dotnet ef migrations add InitialCreate --project DatabaseProvider
    /// 
    /// 1. cd Backend/DatabaseProvider
    /// 2. dotnet ef database update --project DatabaseProvider.csproj --connection "Host=localhost;Database=LainLot;Username=postgres;Password=123456789"
    /// </summary>

    private string? _connectionString;

    public LainLotContext()
    {
    }

    public LainLotContext(DbContextOptions<LainLotContext> options)
        : base(options)
    {
    }

    public virtual DbSet<About> Abouts { get; set; }

    public virtual DbSet<AccessLevel> AccessLevels { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<PostsTranslation> PostsTranslations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var isDevelopment = string.Equals(Environment
                .GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), EnvVariables.Development.ToString(),
                StringComparison.InvariantCultureIgnoreCase);

            if (isDevelopment)
                _connectionString = ConnectionStrings.DEVConnectionString;
            else
                _connectionString = ConnectionStrings.PRODConnectionString;
        }

        optionsBuilder.UseNpgsql(_connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<About>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("About_pkey");

            entity.ToTable("About");

            entity.Property(e => e.Header).HasMaxLength(100);

            entity.HasOne(d => d.FkLanguagesNavigation).WithMany(p => p.Abouts)
                .HasForeignKey(d => d.FkLanguages)
                .HasConstraintName("About_FkLanguages_fkey");
        });

        modelBuilder.Entity<AccessLevel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("AccessLevels_pkey");
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Contacts_pkey");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(255);

            entity.HasOne(d => d.FkLanguagesNavigation).WithMany(p => p.Contacts)
                .HasForeignKey(d => d.FkLanguages)
                .HasConstraintName("Contacts_FkLanguages_fkey");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Languages_pkey");

            entity.Property(e => e.Abbreviation).HasMaxLength(5);
            entity.Property(e => e.DateFormat).HasMaxLength(20);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.TimeFormat).HasMaxLength(20);
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Posts_pkey");

            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<PostsTranslation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PostsTranslations_pkey");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.FkLanguagesNavigation).WithMany(p => p.PostsTranslations)
                .HasForeignKey(d => d.FkLanguages)
                .HasConstraintName("PostsTranslations_FkLanguages_fkey");

            entity.HasOne(d => d.FkPostsNavigation).WithMany(p => p.PostsTranslations)
                .HasForeignKey(d => d.FkPosts)
                .HasConstraintName("PostsTranslations_FkPosts_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.Property(e => e.DateLink).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(60);
            entity.Property(e => e.Login).HasMaxLength(30);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.TimeLink).HasMaxLength(100);

            entity.HasOne(d => d.FkUserRolesNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.FkUserRoles)
                .HasConstraintName("Users_FkUserRoles_fkey");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserProfiles_pkey");

            entity.ToTable("UserProfiles");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Avatar).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.CreateDate).HasMaxLength(50);
            entity.Property(e => e.CreateTime).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.StateProvince).HasMaxLength(50);

            entity.HasOne(d => d.FkUsersNavigation).WithMany(p => p.UserProfiles)
                .HasForeignKey(d => d.FkUsers)
                .HasConstraintName("UserProfiles_FkUsers_fkey");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserRoles_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.FkAccessLevelsNavigation).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.FkAccessLevels)
                .HasConstraintName("UserRoles_FkAccessLevels_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
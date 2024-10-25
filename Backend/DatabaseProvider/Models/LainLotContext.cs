using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatabaseProvider.Models;

public partial class LainLotContext : DbContext
{
    /// <summary>
    /// Scaffold-DbContext "Host=localhost;Database=LainLot;Username=postgres;Password=123456789" Npgsql.EntityFrameworkCore.PostgreSQL -OutputDir Models -Context LainLotContext
    /// Add-Migration InitialCreate -Project DatabaseProvider
    /// Update-Database -Project DatabaseProvider
    /// </summary>

    private readonly ILogger<LainLotContext> _logger;

    public LainLotContext(DbContextOptions<LainLotContext> options, ILogger<LainLotContext> logger)
        : base(options)
    {
        _logger = logger;
    }

    public bool IsConnected() => IsConnected();

    public virtual DbSet<About> Abouts { get; set; }

    public virtual DbSet<AccessLevel> AccessLevels { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CategoryHierarchy> CategoryHierarchies { get; set; }

    public virtual DbSet<Color> Colors { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<CustomizableProduct> CustomizableProducts { get; set; }

    public virtual DbSet<CustomizationOrder> CustomizationOrders { get; set; }

    public virtual DbSet<FabricType> FabricTypes { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderHistory> OrderHistories { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductTranslation> ProductTranslations { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (_logger != null)
        {
            optionsBuilder.LogTo(message => _logger.LogInformation(message));
        }
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

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Cart_pkey");

            entity.ToTable("Cart");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("Cart_FkProducts_fkey");

            entity.HasOne(d => d.FkUsersNavigation).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkUsers)
                .HasConstraintName("Cart_FkUsers_fkey");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Categories_pkey");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.FkLanguagesNavigation).WithMany(p => p.Categories)
                .HasForeignKey(d => d.FkLanguages)
                .HasConstraintName("Categories_FkLanguages_fkey");
        });

        modelBuilder.Entity<CategoryHierarchy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("CategoryHierarchy_pkey");

            entity.ToTable("CategoryHierarchy");

            entity.HasOne(d => d.FkCategoriesNavigation).WithMany(p => p.CategoryHierarchies)
                .HasForeignKey(d => d.FkCategories)
                .HasConstraintName("CategoryHierarchy_FkCategories_fkey");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CategoryHierarchy_ParentId_fkey");
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Colors_pkey");

            entity.Property(e => e.HexCode).HasMaxLength(7);
            entity.Property(e => e.Name).HasMaxLength(50);
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

        modelBuilder.Entity<CustomizableProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("CustomizableProducts_pkey");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkColors)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CustomizableProducts_FkColors_fkey");

            entity.HasOne(d => d.FkFabricTypesNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkFabricTypes)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CustomizableProducts_FkFabricTypes_fkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("CustomizableProducts_FkProducts_fkey");
        });

        modelBuilder.Entity<CustomizationOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("CustomizationOrders_pkey");

            entity.Property(e => e.Size).HasMaxLength(10);

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.CustomizationOrders)
                .HasForeignKey(d => d.FkColors)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CustomizationOrders_FkColors_fkey");

            entity.HasOne(d => d.FkFabricTypesNavigation).WithMany(p => p.CustomizationOrders)
                .HasForeignKey(d => d.FkFabricTypes)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CustomizationOrders_FkFabricTypes_fkey");

            entity.HasOne(d => d.FkOrdersNavigation).WithMany(p => p.CustomizationOrders)
                .HasForeignKey(d => d.FkOrders)
                .HasConstraintName("CustomizationOrders_FkOrders_fkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.CustomizationOrders)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("CustomizationOrders_FkProducts_fkey");
        });

        modelBuilder.Entity<FabricType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FabricTypes_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Languages_pkey");

            entity.Property(e => e.Abbreviation).HasMaxLength(5);
            entity.Property(e => e.DateFormat).HasMaxLength(20);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.TimeFormat).HasMaxLength(20);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Orders_pkey");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.PaymentStatus).HasMaxLength(50);
            entity.Property(e => e.ShippingAddress).HasMaxLength(255);
            entity.Property(e => e.ShippingMethod).HasMaxLength(100);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);
            entity.Property(e => e.TrackingNumber).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkOrderStatusNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkOrderStatus)
                .HasConstraintName("Orders_FkOrderStatus_fkey");

            entity.HasOne(d => d.FkUsersNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkUsers)
                .HasConstraintName("Orders_FkUsers_fkey");
        });

        modelBuilder.Entity<OrderHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("OrderHistory_pkey");

            entity.ToTable("OrderHistory");

            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkOrdersNavigation).WithMany(p => p.OrderHistories)
                .HasForeignKey(d => d.FkOrders)
                .HasConstraintName("OrderHistory_FkOrders_fkey");

            entity.HasOne(d => d.StatusNavigation).WithMany(p => p.OrderHistories)
                .HasForeignKey(d => d.Status)
                .HasConstraintName("OrderHistory_Status_fkey");
        });

        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("OrderStatuses_pkey");

            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Payments_pkey");

            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.FkOrdersNavigation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.FkOrders)
                .HasConstraintName("Payments_FkOrders_fkey");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Products_pkey");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsCustomizable).HasDefaultValue(false);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductImages_pkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("ProductImages_FkProducts_fkey");
        });

        modelBuilder.Entity<ProductTranslation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductTranslations_pkey");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.FkLanguagesNavigation).WithMany(p => p.ProductTranslations)
                .HasForeignKey(d => d.FkLanguages)
                .HasConstraintName("ProductTranslations_FkLanguages_fkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.ProductTranslations)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("ProductTranslations_FkProducts_fkey");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Reviews_pkey");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("Reviews_FkProducts_fkey");

            entity.HasOne(d => d.FkUsersNavigation).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.FkUsers)
                .HasConstraintName("Reviews_FkUsers_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.HasIndex(e => e.Email, "Users_Email_key").IsUnique();

            entity.HasIndex(e => e.Login, "Users_Login_key").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.Email).HasMaxLength(60);
            entity.Property(e => e.Login).HasMaxLength(30);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkUserRolesNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.FkUserRoles)
                .HasConstraintName("Users_FkUserRoles_fkey");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserProfiles_pkey");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Avatar).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.StateProvince).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.ZipPostCode).HasMaxLength(10);

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
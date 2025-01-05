using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatabaseProvider.Models;

public partial class LainLotContext : DbContext
{
    /// <summary>
    /// Scaffold-DbContext "Host=127.0.0.1:5433;Database=LainLot;Username=postgres;Password=123456789" Npgsql.EntityFrameworkCore.PostgreSQL -OutputDir Models -Context LainLotContext -Project DatabaseProvider -f
    /// Add-Migration InitialCreate -Project DatabaseProvider
    /// Update-Database -Project DatabaseProvider
    /// </summary>

    private readonly ILogger<LainLotContext> _logger;

    public LainLotContext(DbContextOptions<LainLotContext> options, ILogger<LainLotContext> logger)
         : base(options)
    {
        _logger = logger;
    }

    public virtual DbSet<About> Abouts { get; set; }

    public virtual DbSet<AccessLevel> AccessLevels { get; set; }

    public virtual DbSet<BeltConstructor> BeltConstructors { get; set; }

    public virtual DbSet<BeltType> BeltTypes { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CategoryHierarchy> CategoryHierarchies { get; set; }

    public virtual DbSet<Color> Colors { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<CustomizableProduct> CustomizableProducts { get; set; }

    public virtual DbSet<FabricType> FabricTypes { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<NeckConstructor> NeckConstructors { get; set; }

    public virtual DbSet<NeckType> NeckTypes { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderHistory> OrderHistories { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<PantsConstructor> PantsConstructors { get; set; }

    public virtual DbSet<PantsCuffConstructor> PantsCuffConstructors { get; set; }

    public virtual DbSet<PantsCuffType> PantsCuffTypes { get; set; }

    public virtual DbSet<PantsType> PantsTypes { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<PaymentStatus> PaymentStatuses { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductOrder> ProductOrders { get; set; }

    public virtual DbSet<ProductTranslation> ProductTranslations { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<ShippingAdress> ShippingAdresses { get; set; }

    public virtual DbSet<SizeOption> SizeOptions { get; set; }

    public virtual DbSet<SleeveConstructor> SleeveConstructors { get; set; }

    public virtual DbSet<SleeveCuffConstructor> SleeveCuffConstructors { get; set; }

    public virtual DbSet<SleeveCuffType> SleeveCuffTypes { get; set; }

    public virtual DbSet<SleeveType> SleeveTypes { get; set; }

    public virtual DbSet<SportSuitConstructor> SportSuitConstructors { get; set; }

    public virtual DbSet<SweaterConstructor> SweaterConstructors { get; set; }

    public virtual DbSet<SweaterType> SweaterTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserOrderHistory> UserOrderHistories { get; set; }

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

        modelBuilder.Entity<BeltConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("BeltConstructor_pkey");

            entity.ToTable("BeltConstructor");

            entity.HasOne(d => d.FkBeltConstructorNavigation).WithMany(p => p.InverseFkBeltConstructorNavigation)
                .HasForeignKey(d => d.FkBeltConstructor)
                .HasConstraintName("BeltConstructor_FkBeltConstructor_fkey");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.BeltConstructors)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("BeltConstructor_FkColors_fkey");
        });

        modelBuilder.Entity<BeltType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("BeltTypes_pkey");
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Cart_pkey");

            entity.ToTable("Cart");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(d => d.FkCurrenciesNavigation).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkCurrencies)
                .HasConstraintName("Cart_FkCurrencies_fkey");

            entity.HasOne(d => d.FkProductOrdersNavigation).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkProductOrders)
                .HasConstraintName("Cart_FkProductOrders_fkey");
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

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Countries_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Currencies_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<CustomizableProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("CustomizableProducts_pkey");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkFabricTypesNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkFabricTypes)
                .HasConstraintName("CustomizableProducts_FkFabricTypes_fkey");

            entity.HasOne(d => d.FkSizeOptionsNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkSizeOptions)
                .HasConstraintName("CustomizableProducts_FkSizeOptions_fkey");

            entity.HasOne(d => d.FkSportSuitConstructorNavigation).WithMany(p => p.CustomizableProducts)
                .HasForeignKey(d => d.FkSportSuitConstructor)
                .HasConstraintName("CustomizableProducts_FkSportSuitConstructor_fkey");
        });

        modelBuilder.Entity<FabricType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FabricTypes_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(d => d.FkCurrenciesNavigation).WithMany(p => p.FabricTypes)
                .HasForeignKey(d => d.FkCurrencies)
                .HasConstraintName("FabricTypes_FkCurrencies_fkey");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Languages_pkey");

            entity.Property(e => e.Abbreviation).HasMaxLength(5);
            entity.Property(e => e.DateFormat).HasMaxLength(20);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.TimeFormat).HasMaxLength(20);
        });

        modelBuilder.Entity<NeckConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("NeckConstructor_pkey");

            entity.ToTable("NeckConstructor");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.NeckConstructors)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("NeckConstructor_FkColors_fkey");

            entity.HasOne(d => d.FkNeckTypesNavigation).WithMany(p => p.NeckConstructors)
                .HasForeignKey(d => d.FkNeckTypes)
                .HasConstraintName("NeckConstructor_FkNeckTypes_fkey");
        });

        modelBuilder.Entity<NeckType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("NeckTypes_pkey");
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
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkOrderStatusNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkOrderStatus)
                .HasConstraintName("Orders_FkOrderStatus_fkey");

            entity.HasOne(d => d.FkPaymentsNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkPayments)
                .HasConstraintName("Orders_FkPayments_fkey");

            entity.HasOne(d => d.FkProductOrdersNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkProductOrders)
                .HasConstraintName("Orders_FkProductOrders_fkey");

            entity.HasOne(d => d.FkShippingAdressesNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkShippingAdresses)
                .HasConstraintName("Orders_FkShippingAdresses_fkey");
        });

        modelBuilder.Entity<OrderHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("OrderHistory_pkey");

            entity.ToTable("OrderHistory");

            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FkOrderStatusesNavigation).WithMany(p => p.OrderHistories)
                .HasForeignKey(d => d.FkOrderStatuses)
                .HasConstraintName("OrderHistory_FkOrderStatuses_fkey");

            entity.HasOne(d => d.FkOrdersNavigation).WithMany(p => p.OrderHistories)
                .HasForeignKey(d => d.FkOrders)
                .HasConstraintName("OrderHistory_FkOrders_fkey");
        });

        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("OrderStatuses_pkey");

            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<PantsConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PantsConstructor_pkey");

            entity.ToTable("PantsConstructor");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.PantsConstructors)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("PantsConstructor_FkColors_fkey");

            entity.HasOne(d => d.FkPantsTypesNavigation).WithMany(p => p.PantsConstructors)
                .HasForeignKey(d => d.FkPantsTypes)
                .HasConstraintName("PantsConstructor_FkPantsTypes_fkey");
        });

        modelBuilder.Entity<PantsCuffConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PantsCuffConstructor_pkey");

            entity.ToTable("PantsCuffConstructor");

            entity.HasOne(d => d.FkColorsLeftNavigation).WithMany(p => p.PantsCuffConstructorFkColorsLeftNavigations)
                .HasForeignKey(d => d.FkColorsLeft)
                .HasConstraintName("PantsCuffConstructor_FkColorsLeft_fkey");

            entity.HasOne(d => d.FkColorsRightNavigation).WithMany(p => p.PantsCuffConstructorFkColorsRightNavigations)
                .HasForeignKey(d => d.FkColorsRight)
                .HasConstraintName("PantsCuffConstructor_FkColorsRight_fkey");

            entity.HasOne(d => d.FkPantsCuffTypesNavigation).WithMany(p => p.PantsCuffConstructors)
                .HasForeignKey(d => d.FkPantsCuffTypes)
                .HasConstraintName("PantsCuffConstructor_FkPantsCuffTypes_fkey");
        });

        modelBuilder.Entity<PantsCuffType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PantsCuffTypes_pkey");
        });

        modelBuilder.Entity<PantsType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PantsTypes_pkey");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Payments_pkey");

            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.PaymentNumber).HasMaxLength(255);
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(d => d.FkCurrenciesNavigation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.FkCurrencies)
                .HasConstraintName("Payments_FkCurrencies_fkey");

            entity.HasOne(d => d.FkPaymentMethodsNavigation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.FkPaymentMethods)
                .HasConstraintName("Payments_FkPaymentMethods_fkey");

            entity.HasOne(d => d.FkPaymentStatusesNavigation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.FkPaymentStatuses)
                .HasConstraintName("Payments_FkPaymentStatuses_fkey");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PaymentMethods_pkey");

            entity.Property(e => e.Method).HasMaxLength(255);
        });

        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PaymentStatuses_pkey");

            entity.Property(e => e.Status).HasMaxLength(50);
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

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.Products)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("Products_FkColors_fkey");

            entity.HasOne(d => d.FkCurrenciesNavigation).WithMany(p => p.Products)
                .HasForeignKey(d => d.FkCurrencies)
                .HasConstraintName("Products_FkCurrencies_fkey");

            entity.HasOne(d => d.FkFabricTypesNavigation).WithMany(p => p.Products)
                .HasForeignKey(d => d.FkFabricTypes)
                .HasConstraintName("Products_FkFabricTypes_fkey");

            entity.HasOne(d => d.FkSizeOptionsNavigation).WithMany(p => p.Products)
                .HasForeignKey(d => d.FkSizeOptions)
                .HasConstraintName("Products_FkSizeOptions_fkey");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductImages_pkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.FkProducts)
                .HasConstraintName("ProductImages_FkProducts_fkey");
        });

        modelBuilder.Entity<ProductOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductOrders_pkey");

            entity.HasOne(d => d.FkCustomizableProductsNavigation).WithMany(p => p.ProductOrders)
                .HasForeignKey(d => d.FkCustomizableProducts)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ProductOrders_FkCustomizableProducts_fkey");

            entity.HasOne(d => d.FkProductsNavigation).WithMany(p => p.ProductOrders)
                .HasForeignKey(d => d.FkProducts)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ProductOrders_FkProducts_fkey");
        });

        modelBuilder.Entity<ProductTranslation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductTranslations_pkey");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.FkCategoriesNavigation).WithMany(p => p.ProductTranslations)
                .HasForeignKey(d => d.FkCategories)
                .HasConstraintName("ProductTranslations_FkCategories_fkey");

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

        modelBuilder.Entity<ShippingAdress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ShippingAdresses_pkey");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.StateProvince).HasMaxLength(50);
            entity.Property(e => e.ZipPostCode).HasMaxLength(10);

            entity.HasOne(d => d.FkCountriesNavigation).WithMany(p => p.ShippingAdresses)
                .HasForeignKey(d => d.FkCountries)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ShippingAdresses_FkCountries_fkey");
        });

        modelBuilder.Entity<SizeOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SizeOptions_pkey");

            entity.Property(e => e.Size).HasMaxLength(20);
        });

        modelBuilder.Entity<SleeveConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SleeveConstructor_pkey");

            entity.ToTable("SleeveConstructor");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.SleeveConstructors)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("SleeveConstructor_FkColors_fkey");

            entity.HasOne(d => d.FkSleeveTypesNavigation).WithMany(p => p.SleeveConstructors)
                .HasForeignKey(d => d.FkSleeveTypes)
                .HasConstraintName("SleeveConstructor_FkSleeveTypes_fkey");
        });

        modelBuilder.Entity<SleeveCuffConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SleeveCuffConstructor_pkey");

            entity.ToTable("SleeveCuffConstructor");

            entity.HasOne(d => d.FkColorsLeftNavigation).WithMany(p => p.SleeveCuffConstructorFkColorsLeftNavigations)
                .HasForeignKey(d => d.FkColorsLeft)
                .HasConstraintName("SleeveCuffConstructor_FkColorsLeft_fkey");

            entity.HasOne(d => d.FkColorsRightNavigation).WithMany(p => p.SleeveCuffConstructorFkColorsRightNavigations)
                .HasForeignKey(d => d.FkColorsRight)
                .HasConstraintName("SleeveCuffConstructor_FkColorsRight_fkey");

            entity.HasOne(d => d.FkSleeveCuffTypesNavigation).WithMany(p => p.SleeveCuffConstructors)
                .HasForeignKey(d => d.FkSleeveCuffTypes)
                .HasConstraintName("SleeveCuffConstructor_FkSleeveCuffTypes_fkey");
        });

        modelBuilder.Entity<SleeveCuffType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SleeveCuffTypes_pkey");
        });

        modelBuilder.Entity<SleeveType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SleeveTypes_pkey");
        });

        modelBuilder.Entity<SportSuitConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SportSuitConstructor_pkey");

            entity.ToTable("SportSuitConstructor");

            entity.HasOne(d => d.FkBeltConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkBeltConstructor)
                .HasConstraintName("SportSuitConstructor_FkBeltConstructor_fkey");

            entity.HasOne(d => d.FkPantsConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkPantsConstructor)
                .HasConstraintName("SportSuitConstructor_FkPantsConstructor_fkey");

            entity.HasOne(d => d.FkPantsCuffConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkPantsCuffConstructor)
                .HasConstraintName("SportSuitConstructor_FkPantsCuffConstructor_fkey");

            entity.HasOne(d => d.FkSleeveConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkSleeveConstructor)
                .HasConstraintName("SportSuitConstructor_FkSleeveConstructor_fkey");

            entity.HasOne(d => d.FkSleeveCuffConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkSleeveCuffConstructor)
                .HasConstraintName("SportSuitConstructor_FkSleeveCuffConstructor_fkey");

            entity.HasOne(d => d.FkSweaterConstructorNavigation).WithMany(p => p.SportSuitConstructors)
                .HasForeignKey(d => d.FkSweaterConstructor)
                .HasConstraintName("SportSuitConstructor_FkSweaterConstructor_fkey");
        });

        modelBuilder.Entity<SweaterConstructor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SweaterConstructor_pkey");

            entity.ToTable("SweaterConstructor");

            entity.HasOne(d => d.FkColorsNavigation).WithMany(p => p.SweaterConstructors)
                .HasForeignKey(d => d.FkColors)
                .HasConstraintName("SweaterConstructor_FkColors_fkey");

            entity.HasOne(d => d.FkSweaterTypesNavigation).WithMany(p => p.SweaterConstructors)
                .HasForeignKey(d => d.FkSweaterTypes)
                .HasConstraintName("SweaterConstructor_FkSweaterTypes_fkey");
        });

        modelBuilder.Entity<SweaterType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SweaterTypes_pkey");
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

        modelBuilder.Entity<UserOrderHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserOrderHistory_pkey");

            entity.ToTable("UserOrderHistory");

            entity.HasOne(d => d.FkOrdersNavigation).WithMany(p => p.UserOrderHistories)
                .HasForeignKey(d => d.FkOrders)
                .HasConstraintName("UserOrderHistory_FkOrders_fkey");
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

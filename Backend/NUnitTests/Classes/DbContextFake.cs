using Microsoft.EntityFrameworkCore;
using DatabaseProvider.Models;

namespace NUnitTests.Classes
{
    public class DbContextFake : DbContext, IDisposable
    {
        public DbContextFake(DbContextOptions<DbContextFake> options)
        : base(options)
        {
        }

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

        public override void Dispose()
        {
            base.Dispose();
        }
    }
}
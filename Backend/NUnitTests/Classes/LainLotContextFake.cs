using DatabaseProvider.Models;
using Microsoft.EntityFrameworkCore;

namespace NUnitTests.Classes
{
    public class LainLotContextFake
    {
        private readonly LainLotContext _dbContext;

        public LainLotContextFake(LainLotContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DbSet<About> Abouts => _dbContext.Abouts;

        public DbSet<AccessLevel> AccessLevels => _dbContext.AccessLevels;

        public DbSet<Cart> Carts => _dbContext.Carts;

        public DbSet<Category> Categories => _dbContext.Categories;

        public DbSet<CategoryHierarchy> CategoryHierarchy => _dbContext.CategoryHierarchies;

        public DbSet<Color> Colors => _dbContext.Colors;

        public DbSet<Contact> Contacts => _dbContext.Contacts;

        public DbSet<CustomizableProduct> CustomizableProducts => _dbContext.CustomizableProducts;

        public DbSet<CustomizationOrder> CustomizationOrders => _dbContext.CustomizationOrders;

        public DbSet<FabricType> FabricTypes => _dbContext.FabricTypes;

        public DbSet<Language> Languages => _dbContext.Languages;

        public DbSet<Order> Orders => _dbContext.Orders;

        public DbSet<OrderHistory> OrderHistory => _dbContext.OrderHistories;

        public DbSet<OrderStatus> OrderStatuses => _dbContext.OrderStatuses;

        public DbSet<Payment> Payments => _dbContext.Payments;

        public DbSet<Product> Products => _dbContext.Products;

        public DbSet<ProductImage> ProductImages => _dbContext.ProductImages;

        public DbSet<ProductTranslation> ProductTranslations => _dbContext.ProductTranslations;

        public DbSet<Review> Reviews => _dbContext.Reviews;

        public DbSet<User> Users => _dbContext.Users;

        public DbSet<UserProfile> UserProfiles => _dbContext.UserProfiles;

        public DbSet<UserRole> UserRoles => _dbContext.UserRoles;
    }
}
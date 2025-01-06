﻿using DatabaseProvider.Models;
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

        public DbSet<CategoryHierarchy> CategoryHierarchies => _dbContext.CategoryHierarchies;

        public DbSet<Color> Colors => _dbContext.Colors;

        public DbSet<Contact> Contacts => _dbContext.Contacts;

        public DbSet<Country> Countries => _dbContext.Countries;

        public DbSet<Currency> Currencies => _dbContext.Currencies;

        public DbSet<CustomizableProduct> CustomizableProducts => _dbContext.CustomizableProducts;

        public DbSet<FabricType> FabricTypes => _dbContext.FabricTypes;

        public DbSet<Language> Languages => _dbContext.Languages;

        public DbSet<Order> Orders => _dbContext.Orders;

        public DbSet<OrderHistory> OrderHistories => _dbContext.OrderHistories;

        public DbSet<OrderStatus> OrderStatuses => _dbContext.OrderStatuses;

        public DbSet<Payment> Payments => _dbContext.Payments;

        public DbSet<PaymentMethod> PaymentMethods => _dbContext.PaymentMethods;

        public DbSet<PaymentStatus> PaymentStatuses => _dbContext.PaymentStatuses;

        public DbSet<Product> Products => _dbContext.Products;

        public DbSet<ProductImage> ProductImages => _dbContext.ProductImages;

        public DbSet<ProductOrder> ProductOrders => _dbContext.ProductOrders;

        public DbSet<ProductTranslation> ProductTranslations => _dbContext.ProductTranslations;

        public DbSet<Review> Reviews => _dbContext.Reviews;

        public DbSet<ShippingAdress> ShippingAdresses => _dbContext.ShippingAdresses;

        public DbSet<SizeOption> SizeOptions => _dbContext.SizeOptions;

        public DbSet<User> Users => _dbContext.Users;

        public DbSet<UserOrderHistory> UserOrderHistories => _dbContext.UserOrderHistories;

        public DbSet<UserProfile> UserProfiles => _dbContext.UserProfiles;

        public DbSet<UserRole> UserRoles => _dbContext.UserRoles;
    }
}
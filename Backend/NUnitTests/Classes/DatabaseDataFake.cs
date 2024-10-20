using DatabaseProvider.Models;
using System.Text;

namespace NUnitTests.Classes
{
    public static class DatabaseDataFake
    {
        public static List<About> GetFakeAboutList()
        {
            return
            [
                new About { Id = 1, FkLanguages = 1, Header = "About Us", Text = "This is about us." },
                new About { Id = 2, FkLanguages = 2, Header = "О нас", Text = "Это о нас." }
            ];
        }

        public static List<AccessLevel> GetFakeAccessLevelList()
        {
            return
            [
                new AccessLevel { Id = 1, Level = 1, Description = "Admin" },
                new AccessLevel { Id = 2, Level = 2, Description = "User" }
            ];
        }

        public static List<Cart> GetFakeCartsList()
        {
            return
            [
                new Cart { Id = 1, FkUsers = 1, FkProducts = 1, Quantity = 2, CreatedAt = DateTime.Now },
                new Cart { Id = 2, FkUsers = 1, FkProducts = 2, Quantity = 1, CreatedAt = DateTime.Now }
            ];
        }

        public static List<Category> GetFakeCategoryList()
        {
            return
            [
                new Category { Id = 1, FkLanguages = 1, Name = "Clothes", Description = "Clothing items." },
                new Category { Id = 2, FkLanguages = 2, Name = "Одежда", Description = "Элементы одежды." }
            ];
        }

        public static List<CategoryHierarchy> GetFakeCategoryHierarchyList()
        {
            return
            [
                new CategoryHierarchy { Id = 1, ParentId = null, FkCategories = 1 },
                new CategoryHierarchy { Id = 2, ParentId = 1, FkCategories = 2 }
            ];
        }

        public static List<Color> GetFakeColorList()
        {
            return
            [
                new Color { Id = 1, Name = "Red", HexCode = "#FF0000" },
                new Color { Id = 2, Name = "Green", HexCode = "#00FF00" }
            ];
        }

        public static List<Contact> GetFakeContactList()
        {
            return
            [
                new Contact { Id = 1, FkLanguages = 1, Address = "123 Main St", Phone = "123-456-7890", Email = "contact@example.com" },
                new Contact { Id = 2, FkLanguages = 2, Address = "123 Кол принципал", Phone = "098-765-4321", Email = "contacto@ejemplo.com" }
            ];
        }

        public static List<CustomizableProduct> GetFakeCustomizableProductList()
        {
            return
            [
                new CustomizableProduct { Id = 1, FkProducts = 1, FkFabricTypes = 1, FkColors = 1, SizeOptions = "S,M,L", CustomizationDetails = "{}" },
                new CustomizableProduct { Id = 2, FkProducts = 2, FkFabricTypes = 2, FkColors = 2, SizeOptions = "M,L", CustomizationDetails = "{}" }
            ];
        }

        public static List<CustomizationOrder> GetFakeCustomizationOrderList()
        {
            return
            [
                new CustomizationOrder { Id = 1, FkOrders = 1, FkProducts = 1, FkFabricTypes = 1, FkColors = 1, Size = "M", AdditionalNotes = "Custom request" },
                new CustomizationOrder { Id = 2, FkOrders = 2, FkProducts = 2, FkFabricTypes = 2, FkColors = 2, Size = "L", AdditionalNotes = "Urgent delivery" }
            ];
        }

        public static List<FabricType> GetFakeFabricTypeList()
        {
            return
            [
                new FabricType { Id = 1, Name = "Cotton", Description = "Soft and breathable fabric." },
                new FabricType { Id = 2, Name = "Polyester", Description = "Durable and wrinkle-resistant fabric." }
            ];
        }

        public static List<Language> GetFakeLanguageList()
        {
            return
            [
                new Language { Id = 1, FullName = "English", Abbreviation = "EN", Description = "English language.", DateFormat = "MM/dd/yyyy", TimeFormat = "hh:mm tt" },
                new Language { Id = 2, FullName = "Russian", Abbreviation = "RU", Description = "Russian language.", DateFormat = "dd/MM/yyyy", TimeFormat = "HH:mm" }
            ];
        }

        public static List<Order> GetFakeOrderList()
        {
            return
            [
                new Order { Id = 1, FkUsers = 1, FkOrderStatus = 1, TotalAmount = 100.00m, OrderDate = DateTime.Now, ShippingAddress = "123 Main St", TrackingNumber = "TRACK123", ShippingMethod = "Standard", PaymentStatus = "Paid" },
                new Order { Id = 2, FkUsers = 2, FkOrderStatus = 2, TotalAmount = 50.00m, OrderDate = DateTime.Now, ShippingAddress = "456 Elm St", TrackingNumber = "TRACK456", ShippingMethod = "Express", PaymentStatus = "Pending" }
            ];
        }

        public static List<OrderHistory> GetFakeOrderHistoryList()
        {
            return
            [
                new OrderHistory { Id = 1, FkOrders = 1, Status = 1, ChangedAt = DateTime.Now },
                new OrderHistory { Id = 2, FkOrders = 2, Status = 2, ChangedAt = DateTime.Now.AddDays(-1) }
            ];
        }

        public static List<OrderStatus> GetFakeOrderStatusList()
        {
            return
            [
                new OrderStatus { Id = 1, Status = "Pending" },
                new OrderStatus { Id = 2, Status = "Shipped" }
            ];
        }

        public static List<Payment> GetFakePaymentList()
        {
            return
            [
                new Payment { Id = 1, FkOrders = 1, PaymentDate = DateTime.Now, Amount = 100.00m, PaymentMethod = "Credit Card", Status = "Completed" },
                new Payment { Id = 2, FkOrders = 2, PaymentDate = DateTime.Now, Amount = 50.00m, PaymentMethod = "PayPal", Status = "Pending" }
            ];
        }

        public static List<Product> GetFakeProductList()
        {
            return
            [
                new Product { Id = 1, Price = 50.00m, StockQuantity = 10, IsActive = true, IsCustomizable = false },
                new Product { Id = 2, Price = 30.00m, StockQuantity = 5, IsActive = true, IsCustomizable = true }
            ];
        }

        public static List<ProductImage> GetFakeProductImageList()
        {
            return
            [
                new ProductImage { Id = 1, FkProducts = 1, ImageData = Encoding.ASCII.GetBytes("https://example.com/image1.jpg") },
                new ProductImage { Id = 2, FkProducts = 2, ImageData = Encoding.ASCII.GetBytes("https://example.com/image3.jpg") }
            ];
        }

        public static List<ProductTranslation> GetFakeProductTranslationList()
        {
            return
            [
                new ProductTranslation { Id = 1, FkLanguages = 1, FkProducts = 1, Name = "Product 1", Description = "Description of Product 1" },
                new ProductTranslation { Id = 2, FkLanguages = 2, FkProducts = 1, Name = "Продукт 1", Description = "Описание продукта 1" }
            ];
        }

        public static List<Review> GetFakeReviewList()
        {
            return
            [
                new Review { Id = 1, FkProducts = 1, FkUsers = 1, Rating = 5, Comment = "Excellent product!", CreatedAt = DateTime.Now },
                new Review { Id = 2, FkProducts = 2, FkUsers = 2, Rating = 4, Comment = "Very good, but could be better.", CreatedAt = DateTime.Now.AddDays(-2) }
            ];
        }

        public static List<User> GetFakeUserList()
        {
            return
            [
                new User { Id = 1, FkUserRoles = 1, Login = "user1", Email = "user1@example.com", Password = "password1", ConfirmEmail = 1, Hash = "hash1", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new User { Id = 2, FkUserRoles = 2, Login = "user2", Email = "user2@example.com", Password = "password2", ConfirmEmail = 1, Hash = "hash2", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
            ];
        }

        public static List<UserProfile> GetFakeUserProfileList()
        {
            return
            [
                new UserProfile { Id = 1, FkUsers = 1, FirstName = "John", LastName = "Doe", MiddleName = "A", Address = "123 Main St", City = "CityA", ZipPostCode = "12345", StateProvince = "StateA", Country = "CountryA", Phone = "123-456-7890", Avatar = "avatar1.png", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new UserProfile { Id = 2, FkUsers = 2, FirstName = "Jane", LastName = "Smith", MiddleName = "B", Address = "456 Elm St", City = "CityB", ZipPostCode = "67890", StateProvince = "StateB", Country = "CountryB", Phone = "098-765-4321", Avatar = "avatar2.png", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
            ];
        }

        public static List<UserRole> GetFakeUserRoleList()
        {
            return
            [
                new UserRole { Id = 1, FkAccessLevels = 1, Name = "Admin" },
                new UserRole { Id = 2, FkAccessLevels = 2, Name = "User" }
            ];
        }
    }
}
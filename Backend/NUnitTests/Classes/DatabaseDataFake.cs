using DatabaseProvider.Models;

namespace NUnitTests.Classes
{
    public static class DatabaseDataFake
    {
        public static List<About> GetFakeAboutList()
        {
            return new List<About>
            {
                new About { Id = 1, FkLanguages = 1, Header = "About Us", Text = "This is about us." },
                new About { Id = 2, FkLanguages = 2, Header = "Sobre nosotros", Text = "Esto es sobre nosotros." },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<AccessLevel> GetFakeAccessLevelList()
        {
            return new List<AccessLevel>
            {
                new AccessLevel { Id = 1, Level = 1, Description = "Admin" },
                new AccessLevel { Id = 2, Level = 2, Description = "User" },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<Cart> GetFakeCartsList()
        {
            return new List<Cart>
            {
                new Cart { Id = 1, FkUsers = 1, FkProducts = 1, Quantity = 2, CreatedAt = DateTime.Now },
                new Cart { Id = 2, FkUsers = 1, FkProducts = 2, Quantity = 1, CreatedAt = DateTime.Now },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<Category> GetFakeCategoryList()
        {
            return new List<Category>
            {
                new Category { Id = 1, FkLanguages = 1, Name = "Clothes", Description = "Clothing items." },
                new Category { Id = 2, FkLanguages = 2, Name = "Ropa", Description = "Artículos de ropa." },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<CategoryHierarchy> GetFakeCategoryHierarchyList()
        {
            return new List<CategoryHierarchy>
            {
                new CategoryHierarchy { Id = 1, ParentId = null, FkCategories = 1 },
                new CategoryHierarchy { Id = 2, ParentId = 1, FkCategories = 2 },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<Color> GetFakeColorList()
        {
            return new List<Color>
            {
                new Color { Id = 1, Name = "Red", HexCode = "#FF0000" },
                new Color { Id = 2, Name = "Green", HexCode = "#00FF00" },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<Contact> GetFakeContactList()
        {
            return new List<Contact>
            {
                new Contact { Id = 1, FkLanguages = 1, Address = "123 Main St", Phone = "123-456-7890", Email = "contact@example.com" },
                new Contact { Id = 2, FkLanguages = 2, Address = "123 Calle Principal", Phone = "098-765-4321", Email = "contacto@ejemplo.com" },
                // Добавьте больше фейковых данных по мере необходимости
            };
        }

        public static List<CustomizableProduct> GetFakeCustomizableProductList()
        {
            return new List<CustomizableProduct>
    {
        new CustomizableProduct { Id = 1, FkProducts = 1, FkFabricTypes = 1, FkColors = 1, SizeOptions = "S,M,L", CustomizationDetails = "{}" },
        new CustomizableProduct { Id = 2, FkProducts = 2, FkFabricTypes = 2, FkColors = 2, SizeOptions = "M,L", CustomizationDetails = "{}" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<CustomizationOrder> GetFakeCustomizationOrderList()
        {
            return new List<CustomizationOrder>
    {
        new CustomizationOrder { Id = 1, FkOrders = 1, FkProducts = 1, FkFabricTypes = 1, FkColors = 1, Size = "M", AdditionalNotes = "Custom request" },
        new CustomizationOrder { Id = 2, FkOrders = 2, FkProducts = 2, FkFabricTypes = 2, FkColors = 2, Size = "L", AdditionalNotes = "Urgent delivery" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<FabricType> GetFakeFabricTypeList()
        {
            return new List<FabricType>
    {
        new FabricType { Id = 1, Name = "Cotton", Description = "Soft and breathable fabric." },
        new FabricType { Id = 2, Name = "Polyester", Description = "Durable and wrinkle-resistant fabric." },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<Language> GetFakeLanguageList()
        {
            return new List<Language>
    {
        new Language { Id = 1, FullName = "English", Abbreviation = "EN", Description = "English language.", DateFormat = "MM/dd/yyyy", TimeFormat = "hh:mm tt" },
        new Language { Id = 2, FullName = "Spanish", Abbreviation = "ES", Description = "Spanish language.", DateFormat = "dd/MM/yyyy", TimeFormat = "HH:mm" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<Order> GetFakeOrderList()
        {
            return new List<Order>
    {
        new Order { Id = 1, FkUsers = 1, FkOrderStatus = 1, TotalAmount = 100.00m, OrderDate = DateTime.Now, ShippingAddress = "123 Main St", TrackingNumber = "TRACK123", ShippingMethod = "Standard", PaymentStatus = "Paid" },
        new Order { Id = 2, FkUsers = 2, FkOrderStatus = 2, TotalAmount = 50.00m, OrderDate = DateTime.Now, ShippingAddress = "456 Elm St", TrackingNumber = "TRACK456", ShippingMethod = "Express", PaymentStatus = "Pending" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<OrderHistory> GetFakeOrderHistoryList()
        {
            return new List<OrderHistory>
    {
        new OrderHistory { Id = 1, FkOrders = 1, Status = 1, ChangedAt = DateTime.Now },
        new OrderHistory { Id = 2, FkOrders = 2, Status = 2, ChangedAt = DateTime.Now.AddDays(-1) },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<OrderStatus> GetFakeOrderStatusList()
        {
            return new List<OrderStatus>
    {
        new OrderStatus { Id = 1, Status = "Pending" },
        new OrderStatus { Id = 2, Status = "Shipped" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<Payment> GetFakePaymentList()
        {
            return new List<Payment>
    {
        new Payment { Id = 1, FkOrders = 1, PaymentDate = DateTime.Now, Amount = 100.00m, PaymentMethod = "Credit Card", Status = "Completed" },
        new Payment { Id = 2, FkOrders = 2, PaymentDate = DateTime.Now, Amount = 50.00m, PaymentMethod = "PayPal", Status = "Pending" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<Product> GetFakeProductList()
        {
            return new List<Product>
    {
        new Product { Id = 1, Price = 50.00m, StockQuantity = 10, IsActive = true, IsCustomizable = false },
        new Product { Id = 2, Price = 30.00m, StockQuantity = 5, IsActive = true, IsCustomizable = true },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<ProductImage> GetFakeProductImageList()
        {
            return new List<ProductImage>
    {
        new ProductImage { Id = 1, FkProducts = 1, ImageData = new byte[] { /* данные изображения */ } },
        new ProductImage { Id = 2, FkProducts = 2, ImageData = new byte[] { /* данные изображения */ } },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<ProductTranslation> GetFakeProductTranslationList()
        {
            return new List<ProductTranslation>
    {
        new ProductTranslation { Id = 1, FkLanguages = 1, FkProducts = 1, Name = "Product 1", Description = "Description of Product 1" },
        new ProductTranslation { Id = 2, FkLanguages = 2, FkProducts = 1, Name = "Продукт 1", Description = "Описание продукта 1" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<Review> GetFakeReviewList()
        {
            return new List<Review>
    {
        new Review { Id = 1, FkProducts = 1, FkUsers = 1, Rating = 5, Comment = "Excellent product!", CreatedAt = DateTime.Now },
        new Review { Id = 2, FkProducts = 2, FkUsers = 2, Rating = 4, Comment = "Very good, but could be better.", CreatedAt = DateTime.Now.AddDays(-2) },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<User> GetFakeUserList()
        {
            return new List<User>
    {
        new User { Id = 1, FkUserRoles = 1, Login = "user1", Email = "user1@example.com", Password = "password1", ConfirmEmail = 1, Hash = "hash1", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
        new User { Id = 2, FkUserRoles = 2, Login = "user2", Email = "user2@example.com", Password = "password2", ConfirmEmail = 1, Hash = "hash2", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<UserProfile> GetFakeUserProfileList()
        {
            return new List<UserProfile>
    {
        new UserProfile { Id = 1, FkUsers = 1, FirstName = "John", LastName = "Doe", MiddleName = "A", Address = "123 Main St", City = "CityA", ZipPostCode = "12345", StateProvince = "StateA", Country = "CountryA", Phone = "123-456-7890", Avatar = "avatar1.png", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
        new UserProfile { Id = 2, FkUsers = 2, FirstName = "Jane", LastName = "Smith", MiddleName = "B", Address = "456 Elm St", City = "CityB", ZipPostCode = "67890", StateProvince = "StateB", Country = "CountryB", Phone = "098-765-4321", Avatar = "avatar2.png", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }

        public static List<UserRole> GetFakeUserRoleList()
        {
            return new List<UserRole>
    {
        new UserRole { Id = 1, FkAccessLevels = 1, Name = "Admin" },
        new UserRole { Id = 2, FkAccessLevels = 2, Name = "User" },
        // Добавьте больше фейковых данных по мере необходимости
    };
        }
    }
}
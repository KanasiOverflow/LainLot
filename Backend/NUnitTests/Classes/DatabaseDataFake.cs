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

        public static List<BeltConstructor> GetFakeBeltConstructorList()
        {
            return
            [
                new BeltConstructor { Id = 1, FkBeltConstructor = 1, FkColors = 1 },
                new BeltConstructor { Id = 2, FkBeltConstructor = 2, FkColors = 2 }
            ];
        }

        public static List<BeltType> GetFakeBeltTypeList()
        {
            return
            [
                new BeltType { Id = 1, ImageData = [0x01, 0x02, 0x03] },
                new BeltType { Id = 2, ImageData = [0x04, 0x05, 0x06] }
            ];
        }

        public static List<Cart> GetFakeCartsList()
        {
            return
            [
                new Cart { Id = 1, FkProductOrders = 1, FkCurrencies = 1, Price = 100, Amount = 10, CreatedAt = DateTime.Now },
                new Cart { Id = 2, FkProductOrders = 1, FkCurrencies = 2, Price = 200, Amount = 20, CreatedAt = DateTime.Now }
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
                new Color { Id = 1, Name = "Red", ImageData = Encoding.ASCII.GetBytes("https://example.com/image1.jpg") },
                new Color { Id = 2, Name = "Green", ImageData = Encoding.ASCII.GetBytes("https://example.com/image3.jpg")}
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

        public static List<Country> GetFakeCountryList()
        {
            return
            [
                new Country { Id = 1, Name = "USA" },
                new Country { Id = 2, Name = "Canada" }
            ];
        }

        public static List<Currency> GetFakeCurrencyList()
        {
            return
            [
                new Currency { Id = 1, Name = "USD" },
                new Currency { Id = 2, Name = "EUR" }
            ];
        }

        public static List<CustomizableProduct> GetFakeCustomizableProductList()
        {
            return
            [
                new CustomizableProduct { Id = 1, FkSportSuitConstructor = 1, FkFabricTypes = 1, FkSizeOptions = 1, Price = 100, CustomizationDetails = "{}", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new CustomizableProduct { Id = 2, FkSportSuitConstructor = 2, FkFabricTypes = 2, FkSizeOptions = 2, Price = 200, CustomizationDetails = "{}", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
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

        public static List<NeckConstructor> GetFakeNeckConstructorList()
        {
            return
            [
                new NeckConstructor { Id = 1, FkNeckTypes = 1, FkColors = 1 },
                new NeckConstructor { Id = 2, FkNeckTypes = 2, FkColors = 2 }
            ];
        }

        public static List<NeckType> GetFakeNeckTypeList()
        {
            return
            [
                new NeckType { Id = 1, ImageData = [0x11, 0x12, 0x13] },
                new NeckType { Id = 2, ImageData = [0x21, 0x22, 0x23] }
            ];
        }

        public static List<Order> GetFakeOrderList()
        {
            return
            [
                new Order { Id = 1, FkProductOrders = 1, FkOrderStatus = 1, FkPayments = 1, FkShippingAdresses = 1, Price = 100, Amount = 10, OrderDate = DateTime.Now, CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now  },
                new Order { Id = 2, FkProductOrders = 2, FkOrderStatus = 2, FkPayments = 2, FkShippingAdresses = 1, Price = 100, Amount = 10, OrderDate = DateTime.Now, CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now  }
            ];
        }

        public static List<OrderHistory> GetFakeOrderHistoryList()
        {
            return
            [
                new OrderHistory { Id = 1, FkOrders = 1, FkOrderStatuses = 1, ChangedAt = DateTime.Now },
                new OrderHistory { Id = 2, FkOrders = 2, FkOrderStatuses = 2, ChangedAt = DateTime.Now.AddDays(-1) }
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

        public static List<PantsConstructor> GetFakePantsConstructorList()
        {
            return
            [
                new PantsConstructor { Id = 1, FkPantsTypes = 1, FkColors = 1 },
                new PantsConstructor { Id = 2, FkPantsTypes = 2, FkColors = 2 }
            ];
        }

        public static List<PantsCuffConstructor> GetFakePantsCuffConstructorList()
        {
            return
            [
                new PantsCuffConstructor { Id = 1, FkPantsCuffTypes = 1, FkColorsLeft = 1, FkColorsRight = 2 },
                new PantsCuffConstructor { Id = 2, FkPantsCuffTypes = 2, FkColorsLeft = 2, FkColorsRight = 3 }
            ];
        }

        public static List<PantsCuffType> GetFakePantsCuffTypeList()
        {
            return
            [
                new PantsCuffType { Id = 1, ImageData = [0x31, 0x32, 0x33] },
                new PantsCuffType { Id = 2, ImageData = [0x41, 0x42, 0x43] }
            ];
        }

        public static List<PantsType> GetFakePantsTypeList()
        {
            return
            [
                new PantsType { Id = 1, ImageData = [0x51, 0x52, 0x53] },
                new PantsType { Id = 2, ImageData = [0x61, 0x62, 0x63] }
            ];
        }

        public static List<Payment> GetFakePaymentList()
        {
            return
            [
                new Payment { Id = 1, FkPaymentMethods = 1, FkCurrencies = 1, FkPaymentStatuses = 1, Price = 100, PaymentDate = DateTime.Now, PaymentNumber = "123" },
                new Payment { Id = 2, FkPaymentMethods = 2, FkCurrencies = 2, FkPaymentStatuses = 1, Price = 100, PaymentDate = DateTime.Now, PaymentNumber = "456" }
            ];
        }

        public static List<PaymentMethod> GetFakePaymentMethodList()
        {
            return
            [
                new PaymentMethod { Id = 1, Method = "Credit Card" },
                new PaymentMethod { Id = 2, Method = "PayPal" }
            ];
        }

        public static List<PaymentStatus> GetFakePaymentStatusList()
        {
            return
            [
                new PaymentStatus { Id = 1, Status = "Pending" },
                new PaymentStatus { Id = 2, Status = "Completed" }
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

        public static List<ProductOrder> GetFakeProductOrderList()
        {
            return
            [
                new ProductOrder { Id = 1, FkProducts = 1, FkCustomizableProducts = null },
                new ProductOrder { Id = 2, FkProducts = null, FkCustomizableProducts = 1 }
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

        public static List<ShippingAdress> GetFakeShippingAddressList()
        {
            return
            [
                new ShippingAdress { Id = 1, FkCountries = 1, Address = "123 Main St", City = "Metropolis", ZipPostCode = "12345", StateProvince = "State1" },
                new ShippingAdress { Id = 2, FkCountries = 2, Address = "456 Elm St", City = "Smallville", ZipPostCode = "67890", StateProvince = "State2" }
            ];
        }

        public static List<SizeOption> GetFakeSizeOptionList()
        {
            return
            [
                new SizeOption { Id = 1, Size = "S" },
                new SizeOption { Id = 2, Size = "M" }
            ];
        }

        public static List<SleeveConstructor> GetFakeSleeveConstructorList()
        {
            return
            [
                new SleeveConstructor { Id = 1, FkSleeveTypes = 1, FkColors = 1 },
                new SleeveConstructor { Id = 2, FkSleeveTypes = 2, FkColors = 2 }
            ];
        }

        public static List<SleeveCuffConstructor> GetFakeSleeveCuffConstructorList()
        {
            return
            [
                new SleeveCuffConstructor { Id = 1, FkSleeveCuffTypes = 1, FkColorsLeft = 1, FkColorsRight = 2 },
                new SleeveCuffConstructor { Id = 2, FkSleeveCuffTypes = 2, FkColorsLeft = 2, FkColorsRight = 3 }
            ];
        }

        public static List<SleeveCuffType> GetFakeSleeveCuffTypeList() => [
                new SleeveCuffType { Id = 1, ImageData = [0x71, 0x72, 0x73] },
                new SleeveCuffType { Id = 2, ImageData = new byte[] { 0x81, 0x82, 0x83 } }
            ];

        public static List<SleeveType> GetFakeSleeveTypeList()
        {
            return
            [
                new SleeveType { Id = 1, ImageData = [0x91, 0x92, 0x93] },
                new SleeveType { Id = 2, ImageData = [0xA1, 0xA2, 0xA3] }
            ];
        }

        public static List<SportSuitConstructor> GetFakeSportSuitConstructorList()
        {
            return
            [
                new SportSuitConstructor { Id = 1, FkSweaterConstructor = 1, FkSleeveConstructor = 1, FkSleeveCuffConstructor = 1,
                                    FkBeltConstructor = 1, FkPantsConstructor = 1, FkPantsCuffConstructor = 1 },
                new SportSuitConstructor { Id = 2, FkSweaterConstructor = 2, FkSleeveConstructor = 2, FkSleeveCuffConstructor = 2,
                                    FkBeltConstructor = 2, FkPantsConstructor = 2, FkPantsCuffConstructor = 2 }
            ];
        }

        public static List<SweaterConstructor> GetFakeSweaterConstructorList()
        {
            return
            [
                new SweaterConstructor { Id = 1, FkSweaterTypes = 1, FkColors = 1 },
                new SweaterConstructor { Id = 2, FkSweaterTypes = 2, FkColors = 2 }
            ];
        }

        public static List<SweaterType> GetFakeSweaterTypeList()
        {
            return
            [
                new SweaterType { Id = 1, ImageData = [0xB1, 0xB2, 0xB3] },
                new SweaterType { Id = 2, ImageData = [0xC1, 0xC2, 0xC3] }
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

        public static List<UserOrderHistory> GetFakeUserOrderHistoryList()
        {
            return
            [
                new UserOrderHistory { Id = 1, FkOrders = 1 },
                new UserOrderHistory { Id = 2, FkOrders = 2 }
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
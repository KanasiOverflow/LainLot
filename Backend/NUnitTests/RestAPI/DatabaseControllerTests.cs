using Moq;
using NUnitTests.Classes;
using RestAPI.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DatabaseRepository.Interfaces;
using DatabaseRepository.Classes;
using DB = DatabaseProvider.Models;
using RestAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace NUnitTests.RestAPI
{
    public class Tests
    {
        private DbContextFake? _context;
        private Mock<ILogger<DatabaseController>> _logger;
        private IRepository<DB.About>? _aboutRepository;
        private IRepository<DB.AccessLevel>? _accessLevelRepository;
        private IRepository<DB.Cart>? _cartRepository; // Добавлено
        private IRepository<DB.Category>? _categoryRepository; // Добавлено
        private IRepository<DB.CategoryHierarchy>? _categoryHierarchyRepository; // Добавлено
        private IRepository<DB.Color>? _colorRepository; // Добавлено
        private IRepository<DB.Contact>? _contactRepository;
        private IRepository<DB.CustomizableProduct>? _customizableProductRepository; // Добавлено
        private IRepository<DB.CustomizationOrder>? _customizationOrderRepository; // Добавлено
        private IRepository<DB.FabricType>? _fabricTypeRepository; // Добавлено
        private IRepository<DB.Language>? _languageRepository;
        private IRepository<DB.Order>? _orderRepository; // Добавлено
        private IRepository<DB.OrderHistory>? _orderHistoryRepository; // Добавлено
        private IRepository<DB.OrderStatus>? _orderStatusRepository; // Добавлено
        private IRepository<DB.Payment>? _paymentRepository; // Добавлено
        private IRepository<DB.Product>? _productRepository;
        private IRepository<DB.ProductImage>? _productImageRepository; // Добавлено
        private IRepository<DB.ProductTranslation>? _productTranslationRepository; // Исправлено название
        private IRepository<DB.Review>? _reviewRepository; // Добавлено
        private IRepository<DB.User>? _userRepository;
        private IRepository<DB.UserProfile>? _userProfileRepository;
        private IRepository<DB.UserRole>? _userRoleRepository;

        private DatabaseController _restApiController;

        private int _limit;
        private int _page;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<DbContextFake>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            // Create a fake DbContext
            _context = new DbContextFake(options);

            // Create fake data
            var abouts = DatabaseDataFake.GetFakeAboutList();
            var accessLevels = DatabaseDataFake.GetFakeAccessLevelList();
            var carts = DatabaseDataFake.GetFakeCartsList(); // Добавлено
            var categories = DatabaseDataFake.GetFakeCategoryList(); // Добавлено
            var categoryHierarchies = DatabaseDataFake.GetFakeCategoryHierarchyList(); // Добавлено
            var colors = DatabaseDataFake.GetFakeColorList(); // Добавлено
            var contacts = DatabaseDataFake.GetFakeContactList();
            var customizableProducts = DatabaseDataFake.GetFakeCustomizableProductList(); // Добавлено
            var customizationOrders = DatabaseDataFake.GetFakeCustomizationOrderList(); // Добавлено
            var fabricTypes = DatabaseDataFake.GetFakeFabricTypeList(); // Добавлено
            var languages = DatabaseDataFake.GetFakeLanguageList();
            var orders = DatabaseDataFake.GetFakeOrderList(); // Добавлено
            var orderHistories = DatabaseDataFake.GetFakeOrderHistoryList(); // Добавлено
            var orderStatuses = DatabaseDataFake.GetFakeOrderStatusList(); // Добавлено
            var payments = DatabaseDataFake.GetFakePaymentList(); // Добавлено
            var products = DatabaseDataFake.GetFakeProductList();
            var productImages = DatabaseDataFake.GetFakeProductImageList(); // Добавлено
            var productTranslations = DatabaseDataFake.GetFakeProductTranslationList(); // Исправлено название
            var reviews = DatabaseDataFake.GetFakeReviewList(); // Добавлено
            var users = DatabaseDataFake.GetFakeUserList();
            var userProfiles = DatabaseDataFake.GetFakeUserProfileList();
            var userRoles = DatabaseDataFake.GetFakeUserRoleList();

            // Init base data in fake DbContext
            _context.Abouts.AddRange(abouts);
            _context.AccessLevels.AddRange(accessLevels);
            _context.Carts.AddRange(carts); // Добавлено
            _context.Categories.AddRange(categories); // Добавлено
            _context.CategoryHierarchies.AddRange(categoryHierarchies); // Добавлено
            _context.Colors.AddRange(colors); // Добавлено
            _context.Contacts.AddRange(contacts);
            _context.CustomizableProducts.AddRange(customizableProducts); // Добавлено
            _context.CustomizationOrders.AddRange(customizationOrders); // Добавлено
            _context.FabricTypes.AddRange(fabricTypes); // Добавлено
            _context.Languages.AddRange(languages);
            _context.Orders.AddRange(orders); // Добавлено
            _context.OrderHistories.AddRange(orderHistories); // Добавлено
            _context.OrderStatuses.AddRange(orderStatuses); // Добавлено
            _context.Payments.AddRange(payments); // Добавлено
            _context.Products.AddRange(products);
            _context.ProductImages.AddRange(productImages); // Добавлено
            _context.ProductTranslations.AddRange(productTranslations); // Исправлено название
            _context.Reviews.AddRange(reviews); // Добавлено
            _context.Users.AddRange(users);
            _context.UserProfiles.AddRange(userProfiles);
            _context.UserRoles.AddRange(userRoles);

            // Save data in fake DbContext
            _context.SaveChanges();

            _logger = new Mock<ILogger<DatabaseController>>();
            _aboutRepository = new Repository<DB.About>(_context);
            _accessLevelRepository = new Repository<DB.AccessLevel>(_context);
            _cartRepository = new Repository<DB.Cart>(_context); // Добавлено
            _categoryRepository = new Repository<DB.Category>(_context); // Добавлено
            _categoryHierarchyRepository = new Repository<DB.CategoryHierarchy>(_context); // Добавлено
            _colorRepository = new Repository<DB.Color>(_context); // Добавлено
            _contactRepository = new Repository<DB.Contact>(_context);
            _customizableProductRepository = new Repository<DB.CustomizableProduct>(_context); // Добавлено
            _customizationOrderRepository = new Repository<DB.CustomizationOrder>(_context); // Добавлено
            _fabricTypeRepository = new Repository<DB.FabricType>(_context); // Добавлено
            _languageRepository = new Repository<DB.Language>(_context);
            _orderRepository = new Repository<DB.Order>(_context); // Добавлено
            _orderHistoryRepository = new Repository<DB.OrderHistory>(_context); // Добавлено
            _orderStatusRepository = new Repository<DB.OrderStatus>(_context); // Добавлено
            _paymentRepository = new Repository<DB.Payment>(_context); // Добавлено
            _productRepository = new Repository<DB.Product>(_context);
            _productImageRepository = new Repository<DB.ProductImage>(_context); // Добавлено
            _productTranslationRepository = new Repository<DB.ProductTranslation>(_context); // Исправлено название
            _reviewRepository = new Repository<DB.Review>(_context); // Добавлено
            _userRepository = new Repository<DB.User>(_context);
            _userProfileRepository = new Repository<DB.UserProfile>(_context);
            _userRoleRepository = new Repository<DB.UserRole>(_context);

            _restApiController = new DatabaseController(
                _logger.Object,
                _aboutRepository,
                _accessLevelRepository,
                _cartRepository, // Добавлено
                _categoryRepository, // Добавлено
                _categoryHierarchyRepository, // Добавлено
                _colorRepository, // Добавлено
                _contactRepository,
                _customizableProductRepository, // Добавлено
                _customizationOrderRepository, // Добавлено
                _fabricTypeRepository, // Добавлено
                _languageRepository,
                _orderRepository, // Добавлено
                _orderHistoryRepository, // Добавлено
                _orderStatusRepository, // Добавлено
                _paymentRepository, // Добавлено
                _productRepository,
                _productImageRepository, // Добавлено
                _productTranslationRepository, // Исправлено название
                _reviewRepository, // Добавлено
                _userRepository,
                _userProfileRepository,
                _userRoleRepository);

            _limit = 100;
            _page = 1;
        }


        [TearDown]
        public void FinishTest()
        {
            _context?.Dispose();
        }

        #region About table

        [Test]
        public void GetAbouts_Return_2_Items()
        {
            var result = _restApiController.GetAbout(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<About>, Has.Count.EqualTo(2));
            });           
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetAboutById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetAboutById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_About_Entity(int id)
        {
            var result = _restApiController.DeleteAbout(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_About_Entity()
        {
            var entity = new About()
            {
                Id = 3,
                FkLanguages = 1,
                Header = "Header 3",
                Text = "Text 3"
            };

            var result = _restApiController.CreateAbout(entity);

            var list = _restApiController.GetAbout(_limit, _page);
            var entityThatWasAdded = _restApiController.GetAboutById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<About>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkLanguages, Is.EqualTo(entity.FkLanguages));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_About_Entity(int id)
        {
            var entity = _restApiController.GetAboutById(id);

            entity.Value.Text = "Text 3";

            _restApiController.UpdateAbout(entity.Value);

            var updateEntity = _restApiController.GetAboutById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Text, Is.EqualTo(entity.Value.Text));
                Assert.That(entity?.Value?.Text, Is.EqualTo(updateEntity?.Value?.Text));
            });
        }

        #endregion

        #region AccessLevels table

        [Test]
        public void GetAccessLevels_Return_2_Items()
        {
            var result = _restApiController.GetAccessLevels(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<AccessLevel>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetAccessLevelById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetAccessLevelById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_AccessLevel_Entity(int id)
        {
            var result = _restApiController.DeleteAccessLevel(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_AccessLevel_Entity()
        {
            var entity = new AccessLevel()
            {
                Id = 3,
                Description = "Description 3",
                Level = 3
            };

            var result = _restApiController.CreateAccessLevel(entity);

            var list = _restApiController.GetAccessLevels(_limit, _page);
            var entityThatWasAdded = _restApiController.GetAccessLevelById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<AccessLevel>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Level, Is.EqualTo(entity.Level));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_AccessLevel_Entity(int id)
        {
            var entity = _restApiController.GetAccessLevelById(id);

            entity.Value.Description = "Text 3";

            _restApiController.UpdateAccessLevel(entity.Value);

            var updateEntity = _restApiController.GetAccessLevelById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Description, Is.EqualTo(entity.Value.Description));
                Assert.That(entity?.Value?.Description, Is.EqualTo(updateEntity?.Value?.Description));
            });
        }

        #endregion

        #region Cart table

        [Test]
        public void GetCarts_Return_2_Items()
        {
            var result = _restApiController.GetCarts(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Cart>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetCartById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetCartById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Cart_Entity(int id)
        {
            var result = _restApiController.DeleteCart(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Cart_Entity()
        {
            var entity = new Cart()
            {
                Id = 3,
                FkUsers = 1,
                FkProducts = 1,
                Quantity = 2,
                CreatedAt = DateTime.Now
            };

            var result = _restApiController.CreateCart(entity);

            var list = _restApiController.GetCarts(_limit, _page);
            var entityThatWasAdded = _restApiController.GetCartById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Cart>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Quantity, Is.EqualTo(entity.Quantity));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Cart_Entity(int id)
        {
            var entity = _restApiController.GetCartById(id);

            entity.Value.Quantity = 5;

            _restApiController.UpdateCart(entity.Value);

            var updateEntity = _restApiController.GetCartById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Quantity, Is.EqualTo(entity.Value.Quantity));
                Assert.That(entity?.Value?.Quantity, Is.EqualTo(updateEntity?.Value?.Quantity));
            });
        }

        #endregion

        #region Categories table

        [Test]
        public void GetCategories_Return_2_Items()
        {
            var result = _restApiController.GetCategories(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Category>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetCategoryById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetCategoryById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Category_Entity(int id)
        {
            var result = _restApiController.DeleteCategory(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Category_Entity()
        {
            var entity = new Category()
            {
                Id = 3,
                FkLanguages = 1,
                Name = "New Category",
                Description = "Category Description"
            };

            var result = _restApiController.CreateCategory(entity);

            var list = _restApiController.GetCategories(_limit, _page);
            var entityThatWasAdded = _restApiController.GetCategoryById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Category>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Name, Is.EqualTo(entity.Name));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Category_Entity(int id)
        {
            var entity = _restApiController.GetCategoryById(id);

            entity.Value.Name = "Updated Name";

            _restApiController.UpdateCategory(entity.Value);

            var updateEntity = _restApiController.GetCategoryById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion

        #region CategoryHierarchy table

        [Test]
        public void GetCategoryHierarchies_Return_2_Items()
        {
            var result = _restApiController.GetCategoryHierarchies(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<CategoryHierarchy>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetCategoryHierarchyById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetCategoryHierarchyById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CategoryHierarchy_Entity(int id)
        {
            var result = _restApiController.DeleteCategoryHierarchy(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_CategoryHierarchy_Entity()
        {
            var entity = new CategoryHierarchy()
            {
                Id = 3,
                ParentId = 1,
                FkCategories = 2
            };

            var result = _restApiController.CreateCategoryHierarchy(entity);

            var list = _restApiController.GetCategoryHierarchies(_limit, _page);
            var entityThatWasAdded = _restApiController.GetCategoryHierarchyById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<CategoryHierarchy>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkCategories, Is.EqualTo(entity.FkCategories));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_CategoryHierarchy_Entity(int id)
        {
            var entity = _restApiController.GetCategoryHierarchyById(id);

            entity.Value.ParentId = 2;

            _restApiController.UpdateCategoryHierarchy(entity.Value);

            var updateEntity = _restApiController.GetCategoryHierarchyById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.ParentId, Is.EqualTo(entity.Value.ParentId));
                Assert.That(entity?.Value?.ParentId, Is.EqualTo(updateEntity?.Value?.ParentId));
            });
        }

        #endregion

        #region Colors table

        [Test]
        public void GetColors_Return_2_Items()
        {
            var result = _restApiController.GetColors(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Color>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetColorById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetColorById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Color_Entity(int id)
        {
            var result = _restApiController.DeleteColor(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Color_Entity()
        {
            var entity = new Color()
            {
                Id = 3,
                Name = "#A020F0"
            };

            var result = _restApiController.CreateColor(entity);

            var list = _restApiController.GetColors(_limit, _page);
            var entityThatWasAdded = _restApiController.GetColorById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Color>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Name, Is.EqualTo(entity.Name));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Color_Entity(int id)
        {
            var entity = _restApiController.GetColorById(id);

            entity.Value.Name = "Updated Name";

            _restApiController.UpdateColor(entity.Value);

            var updateEntity = _restApiController.GetColorById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion

        #region Contacts table

        [Test]
        public void GetContacts_Return_2_Items()
        {
            var result = _restApiController.GetContacts(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Contact>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetContactById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetContactById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Contact_Entity(int id)
        {
            var result = _restApiController.DeleteContact(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Contact_Entity()
        {
            var entity = new Contact()
            {
                Id = 3,
                Address = "Address 3",
                Email = "Email 3",
                FkLanguages = 1,
                Phone = "000-000-000"
            };

            var result = _restApiController.CreateContact(entity);

            var list = _restApiController.GetContacts(_limit, _page);
            var entityThatWasAdded = _restApiController.GetContactById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Contact>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkLanguages, Is.EqualTo(entity.FkLanguages));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Contact_Entity(int id)
        {
            var entity = _restApiController.GetContactById(id);

            entity.Value.Email = "Text 3";

            _restApiController.UpdateContact(entity.Value);

            var updateEntity = _restApiController.GetContactById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Email, Is.EqualTo(entity.Value.Email));
                Assert.That(entity?.Value?.Email, Is.EqualTo(updateEntity?.Value?.Email));
            });
        }

        #endregion

        #region CustomizableProducts table

        [Test]
        public void GetCustomizableProducts_Return_2_Items()
        {
            var result = _restApiController.GetCustomizableProducts(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<CustomizableProduct>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetCustomizableProductById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetCustomizableProductById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CustomizableProduct_Entity(int id)
        {
            var result = _restApiController.DeleteCustomizableProduct(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_CustomizableProduct_Entity()
        {
            var entity = new CustomizableProduct()
            {
                Id = 3,
                FkProducts = 1,
                FkColors = 2,
                FkFabricTypes = 3,
                CustomizationDetails = "Custom Detail 1"
            };

            var result = _restApiController.CreateCustomizableProduct(entity);

            var list = _restApiController.GetCustomizableProducts(_limit, _page);
            var entityThatWasAdded = _restApiController.GetCustomizableProductById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<CustomizableProduct>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.CustomizationDetails, Is.EqualTo(entity.CustomizationDetails));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_CustomizableProduct_Entity(int id)
        {
            var entity = _restApiController.GetCustomizableProductById(id);

            entity.Value.CustomizationDetails = "Updated Detail";

            _restApiController.UpdateCustomizableProduct(entity.Value);

            var updateEntity = _restApiController.GetCustomizableProductById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.CustomizationDetails, Is.EqualTo(entity.Value.CustomizationDetails));
                Assert.That(entity?.Value?.CustomizationDetails, Is.EqualTo(updateEntity?.Value?.CustomizationDetails));
            });
        }

        #endregion

        #region CustomizationOrders table

        [Test]
        public void GetCustomizationOrders_Return_2_Items()
        {
            var result = _restApiController.GetCustomizationOrders(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<CustomizationOrder>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetCustomizationOrderById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetCustomizationOrderById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CustomizationOrder_Entity(int id)
        {
            var result = _restApiController.DeleteCustomizationOrder(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_CustomizationOrder_Entity()
        {
            var entity = new CustomizationOrder()
            {
                Id = 3,
                FkOrders = 1,
                FkProducts = 2,
                FkFabricTypes = 1,
                FkColors = 1,
                Size = "M",
                AdditionalNotes = "Additional Note"
            };

            var result = _restApiController.CreateCustomizationOrder(entity);

            var list = _restApiController.GetCustomizationOrders(_limit, _page);
            var entityThatWasAdded = _restApiController.GetCustomizationOrderById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<CustomizationOrder>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.AdditionalNotes, Is.EqualTo(entity.AdditionalNotes));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_CustomizationOrder_Entity(int id)
        {
            var entity = _restApiController.GetCustomizationOrderById(id);

            entity.Value.AdditionalNotes = "Updated Note";

            _restApiController.UpdateCustomizationOrder(entity.Value);

            var updateEntity = _restApiController.GetCustomizationOrderById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.AdditionalNotes, Is.EqualTo(entity.Value.AdditionalNotes));
                Assert.That(entity?.Value?.AdditionalNotes, Is.EqualTo(updateEntity?.Value?.AdditionalNotes));
            });
        }

        #endregion

        #region FabricTypes table

        [Test]
        public void GetFabricTypes_Return_2_Items()
        {
            var result = _restApiController.GetFabricTypes(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<FabricType>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetFabricTypeById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetFabricTypeById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_FabricType_Entity(int id)
        {
            var result = _restApiController.DeleteFabricType(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_FabricType_Entity()
        {
            var entity = new FabricType()
            {
                Id = 3,
                Name = "Silk"
            };

            var result = _restApiController.CreateFabricType(entity);

            var list = _restApiController.GetFabricTypes(_limit, _page);
            var entityThatWasAdded = _restApiController.GetFabricTypeById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<FabricType>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Name, Is.EqualTo(entity.Name));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_FabricType_Entity(int id)
        {
            var entity = _restApiController.GetFabricTypeById(id);

            entity.Value.Name = "Updated Name";

            _restApiController.UpdateFabricType(entity.Value);

            var updateEntity = _restApiController.GetFabricTypeById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion

        #region Languages table

        [Test]
        public void GetLanguages_Return_2_Items()
        {
            var result = _restApiController.GetLanguages(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Language>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetLanguageById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetLanguageById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Language_Entity(int id)
        {
            var result = _restApiController.DeleteLanguage(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Language_Entity()
        {
            var entity = new Language()
            {
                Id = 3,
                Abbreviation = "PL-PL",
                DateFormat = "DDMMYYYY",
                Description = "Language 3",
                FullName = "Language 3",
                TimeFormat = "HH:MM:SS"
            };

            var result = _restApiController.CreateLanguage(entity);

            var list = _restApiController.GetLanguages(_limit, _page);
            var entityThatWasAdded = _restApiController.GetLanguageById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Language>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Abbreviation, Is.EqualTo(entity.Abbreviation));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Language_Entity(int id)
        {
            var entity = _restApiController.GetLanguageById(id);

            entity.Value.FullName = "Text 3";

            _restApiController.UpdateLanguage(entity.Value);

            var updateEntity = _restApiController.GetLanguageById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.FullName, Is.EqualTo(entity.Value.FullName));
                Assert.That(entity?.Value?.FullName, Is.EqualTo(updateEntity?.Value?.FullName));
            });
        }

        #endregion

        #region Orders

        [Test]
        public void GetOrders_Return_2_Items()
        {
            var result = _restApiController.GetOrders(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Order>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetOrderById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetOrderById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Order_Entity(int id)
        {
            var result = _restApiController.DeleteOrder(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Order_Entity()
        {
            var entity = new Order()
            {
                Id = 3,
                FkUsers = 1,
                FkOrderStatus = 1,
                TotalAmount = 150.50M,
                OrderDate = DateTime.Now,
                ShippingAddress = "ShippingAddress",
                TrackingNumber = "TrackingNumber-000",
                ShippingMethod = "ShippingMethod",
                PaymentStatus = "PaymentStatus",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            var result = _restApiController.CreateOrder(entity);

            var list = _restApiController.GetOrders(_limit, _page);
            var entityThatWasAdded = _restApiController.GetOrderById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Order>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Order_Entity(int id)
        {
            var entity = _restApiController.GetOrderById(id);

            entity.Value.TotalAmount = 200.75M;

            _restApiController.UpdateOrder(entity.Value);

            var updateEntity = _restApiController.GetOrderById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.TotalAmount, Is.EqualTo(entity.Value.TotalAmount));
                Assert.That(entity?.Value?.TotalAmount, Is.EqualTo(updateEntity?.Value?.TotalAmount));
            });
        }

        #endregion

        #region OrderHistory

        [Test]
        public void GetOrderHistory_Return_2_Items()
        {
            var result = _restApiController.GetOrderHistories(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<OrderHistory>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetOrderHistoryById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetOrderHistoryById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_OrderHistory_Entity(int id)
        {
            var result = _restApiController.DeleteOrderHistory(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_OrderHistory_Entity()
        {
            var entity = new OrderHistory()
            {
                Id = 3,
                FkOrders = 1,
                Status = 1,
                ChangedAt = DateTime.Now
            };

            var result = _restApiController.CreateOrderHistory(entity);

            var list = _restApiController.GetOrderHistories(_limit, _page);
            var entityThatWasAdded = _restApiController.GetOrderHistoryById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<OrderHistory>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_OrderHistory_Entity(int id)
        {
            var entity = _restApiController.GetOrderHistoryById(id);

            entity.Value.Status = 3;

            _restApiController.UpdateOrderHistory(entity.Value);

            var updateEntity = _restApiController.GetOrderHistoryById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Status, Is.EqualTo(entity.Value.Status));
                Assert.That(entity?.Value?.Status, Is.EqualTo(updateEntity?.Value?.Status));
            });
        }

        #endregion

        #region OrderStatuses table

        [Test]
        public void GetOrderStatuses_Return_2_Items()
        {
            var result = _restApiController.GetOrderStatuses(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<OrderStatus>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetOrderStatusById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetOrderStatusById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_OrderStatus_Entity(int id)
        {
            var result = _restApiController.DeleteOrderStatus(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_OrderStatus_Entity()
        {
            var entity = new OrderStatus()
            {
                Id = 3,
                Status = "New Order"
            };

            var result = _restApiController.CreateOrderStatus(entity);

            var list = _restApiController.GetOrderStatuses(_limit, _page);
            var entityThatWasAdded = _restApiController.GetOrderStatusById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<OrderStatus>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Status, Is.EqualTo(entity.Status));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_OrderStatus_Entity(int id)
        {
            var entity = _restApiController.GetOrderStatusById(id);

            entity.Value.Status = "Updated Status";

            _restApiController.UpdateOrderStatus(entity.Value);

            var updateEntity = _restApiController.GetOrderStatusById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Status, Is.EqualTo(entity.Value.Status));
                Assert.That(entity?.Value?.Status, Is.EqualTo(updateEntity?.Value?.Status));
            });
        }

        #endregion

        #region Payments table

        [Test]
        public void GetPayments_Return_2_Items()
        {
            var result = _restApiController.GetPayments(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Payment>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetPaymentById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetPaymentById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Payment_Entity(int id)
        {
            var result = _restApiController.DeletePayment(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Payment_Entity()
        {
            var entity = new Payment()
            {
                Id = 3,
                FkOrders = 1,
                PaymentDate = DateTime.Now,
                Amount = 99.99m,
                PaymentMethod = "Credit Card",
                Status = "Completed"
            };

            var result = _restApiController.CreatePayment(entity);

            var list = _restApiController.GetPayments(_limit, _page);
            var entityThatWasAdded = _restApiController.GetPaymentById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Payment>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Amount, Is.EqualTo(entity.Amount));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Payment_Entity(int id)
        {
            var entity = _restApiController.GetPaymentById(id);

            entity.Value.Status = "Pending";

            _restApiController.UpdatePayment(entity.Value);

            var updateEntity = _restApiController.GetPaymentById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Status, Is.EqualTo(entity.Value.Status));
                Assert.That(entity?.Value?.Status, Is.EqualTo(updateEntity?.Value?.Status));
            });
        }

        #endregion

        #region Products table

        [Test]
        public void GetProducts_Return_2_Items()
        {
            var result = _restApiController.GetProducts(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Product>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetProductById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetProductById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Product_Entity(int id)
        {
            var result = _restApiController.DeleteProduct(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Product_Entity()
        {
            var entity = new Product()
            {
                Id = 3,
                Price = 19.99m,
                StockQuantity = 100,
                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            var result = _restApiController.CreateProduct(entity);

            var list = _restApiController.GetProducts(_limit, _page);
            var entityThatWasAdded = _restApiController.GetProductById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Product>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Price, Is.EqualTo(entity.Price));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Product_Entity(int id)
        {
            var entity = _restApiController.GetProductById(id);

            entity.Value.Price = 29.99m;

            _restApiController.UpdateProduct(entity.Value);

            var updateEntity = _restApiController.GetProductById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Price, Is.EqualTo(entity.Value.Price));
                Assert.That(entity?.Value?.Price, Is.EqualTo(updateEntity?.Value?.Price));
            });
        }

        #endregion

        #region ProductImages table

        [Test]
        public void GetProductImages_Return_2_Items()
        {
            var result = _restApiController.GetProductImages(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<ProductImage>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetProductImageById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetProductImageById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_ProductImage_Entity(int id)
        {
            var result = _restApiController.DeleteProductImage(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_ProductImage_Entity()
        {
            var entity = new ProductImage()
            {
                Id = 3,
                FkProducts = 1,
                ImageData = Encoding.ASCII.GetBytes("https://example.com/image3.jpg")
            };

            var result = _restApiController.CreateProductImage(entity);

            var list = _restApiController.GetProductImages(_limit, _page);
            var entityThatWasAdded = _restApiController.GetProductImageById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<ProductImage>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.ImageData, Is.EqualTo(entity.ImageData));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_ProductImage_Entity(int id)
        {
            var entity = _restApiController.GetProductImageById(id);

            entity.Value.ImageData = Encoding.ASCII.GetBytes("https://example.com/updated_image.jpg");

            _restApiController.UpdateProductImage(entity.Value);

            var updateEntity = _restApiController.GetProductImageById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.ImageData, Is.EqualTo(entity.Value.ImageData));
                Assert.That(entity?.Value?.ImageData, Is.EqualTo(updateEntity?.Value?.ImageData));
            });
        }

        #endregion

        #region ProductTranslations table

        [Test]
        public void GetProductTranslations_Return_2_Items()
        {
            var result = _restApiController.GetProductTranslations(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<ProductTranslation>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetProductTranslationById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetProductTranslationById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_ProductTranslation_Entity(int id)
        {
            var result = _restApiController.DeleteProductTranslation(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_ProductTranslation_Entity()
        {
            var entity = new ProductTranslation()
            {
                Id = 3,
                FkLanguages = 1,
                FkProducts = 1,               
                Name = "Product 3",
                Description = "Description for Product 3"
            };

            var result = _restApiController.CreateProductTranslation(entity);

            var list = _restApiController.GetProductTranslations(_limit, _page);
            var entityThatWasAdded = _restApiController.GetProductTranslationById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<ProductTranslation>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Name, Is.EqualTo(entity.Name));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_ProductTranslation_Entity(int id)
        {
            var entity = _restApiController.GetProductTranslationById(id);

            entity.Value.Name = "Updated Product Name";

            _restApiController.UpdateProductTranslation(entity.Value);

            var updateEntity = _restApiController.GetProductTranslationById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion

        #region Reviews table

        [Test]
        public void GetReviews_Return_2_Items()
        {
            var result = _restApiController.GetReviews(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Review>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetReviewById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetReviewById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Review_Entity(int id)
        {
            var result = _restApiController.DeleteReview(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_Review_Entity()
        {
            var entity = new Review()
            {
                Id = 3,
                FkProducts = 1,
                FkUsers = 1,
                Rating = 5,
                Comment = "Excellent product!",
                CreatedAt = DateTime.Now
            };

            var result = _restApiController.CreateReview(entity);

            var list = _restApiController.GetReviews(_limit, _page);
            var entityThatWasAdded = _restApiController.GetReviewById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<Review>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.Comment, Is.EqualTo(entity.Comment));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Review_Entity(int id)
        {
            var entity = _restApiController.GetReviewById(id);

            entity.Value.Comment = "Updated comment.";

            _restApiController.UpdateReview(entity.Value);

            var updateEntity = _restApiController.GetReviewById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Comment, Is.EqualTo(entity.Value.Comment));
                Assert.That(entity?.Value?.Comment, Is.EqualTo(updateEntity?.Value?.Comment));
            });
        }

        #endregion

        #region Users table

        [Test]
        public void GetUsers_Return_2_Items()
        {
            var result = _restApiController.GetUsers(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<User>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetUserById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetUserById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });            
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_User_Entity(int id)
        {
            var result = _restApiController.DeleteUser(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_User_Entity()
        {
            var entity = new User()
            {
                Id = 3,
                FkUserRoles = 1,
                Login = "Login 3",
                Email = "Email 3",
                Password = "Password 3",
                ConfirmEmail = 0,
                Hash = "Hash 3"
            };

            var result = _restApiController.CreateUser(entity);

            var list = _restApiController.GetUsers(_limit, _page);
            var entityThatWasAdded = _restApiController.GetUserById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<User>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkUserRoles, Is.EqualTo(entity.FkUserRoles));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_User_Entity(int id)
        {
            var entity = _restApiController.GetUserById(id);

            entity.Value.Email = "Text 3";

            _restApiController.UpdateUser(entity.Value);

            var updateEntity = _restApiController.GetUserById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Email, Is.EqualTo(entity.Value.Email));
                Assert.That(entity?.Value?.Email, Is.EqualTo(updateEntity?.Value?.Email));
            });
        }

        #endregion

        #region UserProfiles table

        [Test]
        public void GetUserProfiles_Return_2_Items()
        {
            var result = _restApiController.GetUserProfiles(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<UserProfile>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetUserProfileById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetUserProfileById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_UserProfile_Entity(int id)
        {
            var result = _restApiController.DeleteUserProfile(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_UserProfile_Entity()
        {
            var entity = new UserProfile()
            {
                Id = 3,
                FkUsers = 1,
                FirstName = "FirstName 3",
                LastName = "LastName 3",
                MiddleName = "MiddleName 3",
                Address = "Address 3",
                City = "City 3",
                StateProvince = "StateProvince 3",
                Country = "Country 3",
                Phone = "Phone 3",
                Avatar = "Avatar 3"
            };

            var result = _restApiController.CreateUserProfile(entity);

            var list = _restApiController.GetUserProfiles(_limit, _page);
            var entityThatWasAdded = _restApiController.GetUserProfileById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<UserProfile>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkUsers, Is.EqualTo(entity.FkUsers));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_UserProfile_Entity(int id)
        {
            var entity = _restApiController.GetUserProfileById(id);

            entity.Value.LastName = "Text 3";

            _restApiController.UpdateUserProfile(entity.Value);

            var updateEntity = _restApiController.GetUserProfileById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.LastName, Is.EqualTo(entity.Value.LastName));
                Assert.That(entity?.Value?.LastName, Is.EqualTo(updateEntity?.Value?.LastName));
            });
        }

        #endregion

        #region UserRoles table

        [Test]
        public void GetUserRoles_Return_2_Items()
        {
            var result = _restApiController.GetUserRoles(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<UserRole>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetUserRoleById_Return_Correct_Entity(int id)
        {
            var result = _restApiController.GetUserRoleById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_UserRole_Entity(int id)
        {
            var result = _restApiController.DeleteUserRole(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public void Add_UserRole_Entity()
        {
            var entity = new UserRole()
            {
                Id = 3,
                FkAccessLevels = 1,
                Name = "Name 3"
            };

            var result = _restApiController.CreateUserRole(entity);

            var list = _restApiController.GetUserRoles(_limit, _page);
            var entityThatWasAdded = _restApiController.GetUserRoleById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list.Value as List<UserRole>, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded.Value?.FkAccessLevels, Is.EqualTo(entity.FkAccessLevels));
                Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_UserRole_Entity(int id)
        {
            var entity = _restApiController.GetUserRoleById(id);

            entity.Value.Name = "Text 3";

            _restApiController.UpdateUserRole(entity.Value);

            var updateEntity = _restApiController.GetUserRoleById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion
    }
}
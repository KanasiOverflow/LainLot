using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NUnitTests.Classes;
using Moq;
using RestAPI.Controllers;
using DatabaseRepository.Classes;
using DatabaseRepository.Interfaces;
using DB = DatabaseProvider.Models;
using RestAPI.Models;

namespace NUnitTests.RestAPI
{
    public class Tests
    {
        private Mock<ILogger<DatabaseController>> _logger; 
        private Mock<ILogger<DB.LainLotContext>> _contextLogger;
        private DB.LainLotContext? _context;

        private Mock<ILogger<Repository<DB.About>>> _aboutLogger;
        private Mock<ILogger<Repository<DB.AccessLevel>>> _accessLevelLogger;
        private Mock<ILogger<Repository<DB.Cart>>> _cartLogger;
        private Mock<ILogger<Repository<DB.Category>>> _categoryLogger;
        private Mock<ILogger<Repository<DB.CategoryHierarchy>>> _categoryHierarchyLogger;
        private Mock<ILogger<Repository<DB.Color>>> _colorLogger;
        private Mock<ILogger<Repository<DB.Contact>>> _contactLogger;
        private Mock<ILogger<Repository<DB.CustomizableProduct>>> _customizableProductLogger;
        private Mock<ILogger<Repository<DB.CustomizationOrder>>> _customizationOrderLogger;
        private Mock<ILogger<Repository<DB.FabricType>>> _fabricTypeLogger;
        private Mock<ILogger<Repository<DB.Language>>> _languageLogger;
        private Mock<ILogger<Repository<DB.Order>>> _orderLogger;
        private Mock<ILogger<Repository<DB.OrderHistory>>> _orderHistoryLogger;
        private Mock<ILogger<Repository<DB.OrderStatus>>> _orderStatusLogger;
        private Mock<ILogger<Repository<DB.Payment>>> _paymentLogger;
        private Mock<ILogger<Repository<DB.Product>>> _productLogger;
        private Mock<ILogger<Repository<DB.ProductImage>>> _productImageLogger;
        private Mock<ILogger<Repository<DB.ProductTranslation>>> _productTranslationLogger;
        private Mock<ILogger<Repository<DB.Review>>> _reviewLogger;
        private Mock<ILogger<Repository<DB.User>>> _userLogger;
        private Mock<ILogger<Repository<DB.UserProfile>>> _userProfileLogger;
        private Mock<ILogger<Repository<DB.UserRole>>> _userRoleLogger;
        // Repositories
        private IRepository<DB.About>? _aboutRepository;
        private IRepository<DB.AccessLevel>? _accessLevelRepository;
        private IRepository<DB.Cart>? _cartRepository;
        private IRepository<DB.Category>? _categoryRepository;
        private IRepository<DB.CategoryHierarchy>? _categoryHierarchyRepository;
        private IRepository<DB.Color>? _colorRepository;
        private IRepository<DB.Contact>? _contactRepository;
        private IRepository<DB.CustomizableProduct>? _customizableProductRepository;
        private IRepository<DB.CustomizationOrder>? _customizationOrderRepository;
        private IRepository<DB.FabricType>? _fabricTypeRepository;
        private IRepository<DB.Language>? _languageRepository;
        private IRepository<DB.Order>? _orderRepository;
        private IRepository<DB.OrderHistory>? _orderHistoryRepository;
        private IRepository<DB.OrderStatus>? _orderStatusRepository;
        private IRepository<DB.Payment>? _paymentRepository;
        private IRepository<DB.Product>? _productRepository;
        private IRepository<DB.ProductImage>? _productImageRepository;
        private IRepository<DB.ProductTranslation>? _productTranslationRepository;
        private IRepository<DB.Review>? _reviewRepository;
        private IRepository<DB.User>? _userRepository;
        private IRepository<DB.UserProfile>? _userProfileRepository;
        private IRepository<DB.UserRole>? _userRoleRepository;

        private DatabaseController _restApiController;

        private int _limit;
        private int _page;

        [SetUp]
        public void Setup()
        {
            _contextLogger = new Mock<ILogger<DB.LainLotContext>>();

            var options = new DbContextOptionsBuilder<DB.LainLotContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            // Create a fake DbContext
            _context = new DB.LainLotContext(options, _contextLogger.Object);

            // Create fake loggers
            _aboutLogger = new Mock<ILogger<Repository<DB.About>>>();
            _accessLevelLogger = new Mock<ILogger<Repository<DB.AccessLevel>>>();
            _cartLogger = new Mock<ILogger<Repository<DB.Cart>>>();
            _categoryLogger = new Mock<ILogger<Repository<DB.Category>>>();
            _categoryHierarchyLogger = new Mock<ILogger<Repository<DB.CategoryHierarchy>>>();
            _colorLogger = new Mock<ILogger<Repository<DB.Color>>>();
            _contactLogger = new Mock<ILogger<Repository<DB.Contact>>>();
            _customizableProductLogger = new Mock<ILogger<Repository<DB.CustomizableProduct>>>();
            _customizationOrderLogger = new Mock<ILogger<Repository<DB.CustomizationOrder>>>();
            _fabricTypeLogger = new Mock<ILogger<Repository<DB.FabricType>>>();
            _languageLogger = new Mock<ILogger<Repository<DB.Language>>>();
            _orderLogger = new Mock<ILogger<Repository<DB.Order>>>();
            _orderHistoryLogger = new Mock<ILogger<Repository<DB.OrderHistory>>>();
            _orderStatusLogger = new Mock<ILogger<Repository<DB.OrderStatus>>>();
            _paymentLogger = new Mock<ILogger<Repository<DB.Payment>>>();
            _productLogger = new Mock<ILogger<Repository<DB.Product>>>();
            _productImageLogger = new Mock<ILogger<Repository<DB.ProductImage>>>();
            _productTranslationLogger = new Mock<ILogger<Repository<DB.ProductTranslation>>>();
            _reviewLogger = new Mock<ILogger<Repository<DB.Review>>>();
            _userLogger = new Mock<ILogger<Repository<DB.User>>>();
            _userProfileLogger = new Mock<ILogger<Repository<DB.UserProfile>>>();
            _userRoleLogger = new Mock<ILogger<Repository<DB.UserRole>>>();

            // Create fake data
            var abouts = DatabaseDataFake.GetFakeAboutList();
            var accessLevels = DatabaseDataFake.GetFakeAccessLevelList();
            var carts = DatabaseDataFake.GetFakeCartsList(); 
            var categories = DatabaseDataFake.GetFakeCategoryList(); 
            var categoryHierarchies = DatabaseDataFake.GetFakeCategoryHierarchyList(); 
            var colors = DatabaseDataFake.GetFakeColorList(); 
            var contacts = DatabaseDataFake.GetFakeContactList();
            var customizableProducts = DatabaseDataFake.GetFakeCustomizableProductList(); 
            var customizationOrders = DatabaseDataFake.GetFakeCustomizationOrderList(); 
            var fabricTypes = DatabaseDataFake.GetFakeFabricTypeList(); 
            var languages = DatabaseDataFake.GetFakeLanguageList();
            var orders = DatabaseDataFake.GetFakeOrderList(); 
            var orderHistories = DatabaseDataFake.GetFakeOrderHistoryList(); 
            var orderStatuses = DatabaseDataFake.GetFakeOrderStatusList(); 
            var payments = DatabaseDataFake.GetFakePaymentList(); 
            var products = DatabaseDataFake.GetFakeProductList();
            var productImages = DatabaseDataFake.GetFakeProductImageList(); 
            var productTranslations = DatabaseDataFake.GetFakeProductTranslationList(); 
            var reviews = DatabaseDataFake.GetFakeReviewList(); 
            var users = DatabaseDataFake.GetFakeUserList();
            var userProfiles = DatabaseDataFake.GetFakeUserProfileList();
            var userRoles = DatabaseDataFake.GetFakeUserRoleList();

            // Init base data in fake DbContext
            _context.Abouts.AddRange(abouts);
            _context.AccessLevels.AddRange(accessLevels);
            _context.Carts.AddRange(carts); 
            _context.Categories.AddRange(categories); 
            _context.CategoryHierarchies.AddRange(categoryHierarchies); 
            _context.Colors.AddRange(colors); 
            _context.Contacts.AddRange(contacts);
            _context.CustomizableProducts.AddRange(customizableProducts); 
            _context.CustomizationOrders.AddRange(customizationOrders); 
            _context.FabricTypes.AddRange(fabricTypes); 
            _context.Languages.AddRange(languages);
            _context.Orders.AddRange(orders); 
            _context.OrderHistories.AddRange(orderHistories); 
            _context.OrderStatuses.AddRange(orderStatuses); 
            _context.Payments.AddRange(payments); 
            _context.Products.AddRange(products);
            _context.ProductImages.AddRange(productImages); 
            _context.ProductTranslations.AddRange(productTranslations); 
            _context.Reviews.AddRange(reviews); 
            _context.Users.AddRange(users);
            _context.UserProfiles.AddRange(userProfiles);
            _context.UserRoles.AddRange(userRoles);

            // Save data in fake DbContext
            _context.SaveChanges();

            _logger = new Mock<ILogger<DatabaseController>>();
            // Create all instances for repositories
            _aboutRepository = new Repository<DB.About>(_context, _aboutLogger.Object);
            _accessLevelRepository = new Repository<DB.AccessLevel>(_context, _accessLevelLogger.Object);
            _cartRepository = new Repository<DB.Cart>(_context, _cartLogger.Object);
            _categoryRepository = new Repository<DB.Category>(_context, _categoryLogger.Object);
            _categoryHierarchyRepository = new Repository<DB.CategoryHierarchy>(_context, _categoryHierarchyLogger.Object);
            _colorRepository = new Repository<DB.Color>(_context, _colorLogger.Object);
            _contactRepository = new Repository<DB.Contact>(_context, _contactLogger.Object);
            _customizableProductRepository = new Repository<DB.CustomizableProduct>(_context, _customizableProductLogger.Object);
            _customizationOrderRepository = new Repository<DB.CustomizationOrder>(_context, _customizationOrderLogger.Object);
            _fabricTypeRepository = new Repository<DB.FabricType>(_context, _fabricTypeLogger.Object);
            _languageRepository = new Repository<DB.Language>(_context, _languageLogger.Object);
            _orderRepository = new Repository<DB.Order>(_context, _orderLogger.Object);
            _orderHistoryRepository = new Repository<DB.OrderHistory>(_context, _orderHistoryLogger.Object);
            _orderStatusRepository = new Repository<DB.OrderStatus>(_context, _orderStatusLogger.Object);
            _paymentRepository = new Repository<DB.Payment>(_context, _paymentLogger.Object);
            _productRepository = new Repository<DB.Product>(_context, _productLogger.Object);
            _productImageRepository = new Repository<DB.ProductImage>(_context, _productImageLogger.Object);
            _productTranslationRepository = new Repository<DB.ProductTranslation>(_context, _productTranslationLogger.Object);
            _reviewRepository = new Repository<DB.Review>(_context, _reviewLogger.Object);
            _userRepository = new Repository<DB.User>(_context, _userLogger.Object);
            _userProfileRepository = new Repository<DB.UserProfile>(_context, _userProfileLogger.Object);
            _userRoleRepository = new Repository<DB.UserRole>(_context, _userRoleLogger.Object);

            _restApiController = new DatabaseController(
                _logger.Object,
                _aboutRepository,
                _accessLevelRepository,
                _cartRepository, 
                _categoryRepository, 
                _categoryHierarchyRepository, 
                _colorRepository, 
                _contactRepository,
                _customizableProductRepository, 
                _customizationOrderRepository, 
                _fabricTypeRepository, 
                _languageRepository,
                _orderRepository, 
                _orderHistoryRepository, 
                _orderStatusRepository, 
                _paymentRepository, 
                _productRepository,
                _productImageRepository, 
                _productTranslationRepository, 
                _reviewRepository, 
                _userRepository,
                _userProfileRepository,
                _userRoleRepository);

            _limit = 100;
            _page = 1;
        }


        [TearDown]
        public void FinishTest()
        {
            _context?.Database.EnsureDeleted();
            _context?.ChangeTracker.Clear();
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
        public async Task GetAboutById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetAboutById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_About_Entity(int id)
        {
            var result = await _restApiController.DeleteAbout(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_About_Entity()
        {
            var entity = new About()
            {
                Id = 3,
                FkLanguages = 1,
                Header = "Header 3",
                Text = "Text 3"
            };

            var result = await _restApiController.CreateAboutAsync(entity);

            var list = _restApiController.GetAbout(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetAboutById(3);

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
        public async Task Update_About_Entity(int id)
        {
            var entity = await _restApiController.GetAboutById(id);

            entity.Value.Text = "Text 3";

            await _restApiController.UpdateAboutAsync(entity.Value);

            var updateEntity = await _restApiController.GetAboutById(id);

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
        public async Task GetAccessLevelById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetAccessLevelsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_AccessLevel_Entity(int id)
        {
            var result = await _restApiController.DeleteAccessLevels(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_AccessLevel_Entity()
        {
            var entity = new AccessLevel()
            {
                Id = 3,
                Description = "Description 3",
                Level = 3
            };

            var result = await _restApiController.CreateAccessLevelsAsync(entity);

            var list = _restApiController.GetAccessLevels(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetAccessLevelsById(3);

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
        public async Task Update_AccessLevel_Entity(int id)
        {
            var entity = await _restApiController.GetAccessLevelsById(id);

            entity.Value.Description = "Text 3";

            await _restApiController.UpdateAccessLevelsAsync(entity.Value);

            var updateEntity = await _restApiController.GetAccessLevelsById(id);

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
            var result = _restApiController.GetCart(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<Cart>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCartById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetCartById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Cart_Entity(int id)
        {
            var result = await _restApiController.DeleteCart(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Cart_Entity()
        {
            var entity = new Cart()
            {
                Id = 3,
                FkUsers = 1,
                FkProducts = 1,
                Quantity = 2,
                CreatedAt = DateTime.Now
            };

            var result = await _restApiController.CreateCartAsync(entity);

            var list = _restApiController.GetCart(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetCartById(3);

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
        public async Task Update_Cart_Entity(int id)
        {
            var entity = await _restApiController.GetCartById(id);

            entity.Value.Quantity = 5;

            await _restApiController.UpdateCartAsync(entity.Value);

            var updateEntity = await _restApiController.GetCartById(id);

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
        public async Task GetCategoryById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetCategoriesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Category_Entity(int id)
        {
            var result = await _restApiController.DeleteCategories(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Category_Entity()
        {
            var entity = new Category()
            {
                Id = 3,
                FkLanguages = 1,
                Name = "New Category",
                Description = "Category Description"
            };

            var result = await _restApiController.CreateCategoriesAsync(entity);

            var list = _restApiController.GetCategories(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetCategoriesById(3);

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
        public async Task Update_Category_Entity(int id)
        {
            var entity = await _restApiController.GetCategoriesById(id);

            entity.Value.Name = "Updated Name";

            await _restApiController.UpdateCategoriesAsync(entity.Value);

            var updateEntity = await _restApiController.GetCategoriesById(id);

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
            var result = _restApiController.GetCategoryHierarchy(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<CategoryHierarchy>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCategoryHierarchyById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetCategoryHierarchyById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CategoryHierarchy_Entity(int id)
        {
            var result = await _restApiController.DeleteCategoryHierarchy(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_CategoryHierarchy_Entity()
        {
            var entity = new CategoryHierarchy()
            {
                Id = 3,
                ParentId = 1,
                FkCategories = 2
            };

            var result = await _restApiController.CreateCategoryHierarchyAsync(entity);

            var list = _restApiController.GetCategoryHierarchy(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetCategoryHierarchyById(3);

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
        public async Task Update_CategoryHierarchy_Entity(int id)
        {
            var entity = await _restApiController.GetCategoryHierarchyById(id);

            entity.Value.ParentId = 2;

            await _restApiController.UpdateCategoryHierarchyAsync(entity.Value);

            var updateEntity = await _restApiController.GetCategoryHierarchyById(id);

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
        public async Task GetColorById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetColorsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Color_Entity(int id)
        {
            var result = await _restApiController.DeleteColors(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Color_Entity()
        {
            var entity = new Color()
            {
                Id = 3,
                Name = "Purple",
                HexCode = "#A020F0"
            };

            var result = await _restApiController.CreateColorsAsync(entity);

            var list = _restApiController.GetColors(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetColorsById(3);

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
        public async Task Update_Color_Entity(int id)
        {
            var entity = await _restApiController.GetColorsById(id);

            entity.Value.Name = "Updated Name";

            await _restApiController.UpdateColorsAsync(entity.Value);

            var updateEntity = await _restApiController.GetColorsById(id);

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
        public async Task GetContactById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetContactsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Contact_Entity(int id)
        {
            var result = await _restApiController.DeleteContacts(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Contact_Entity()
        {
            var entity = new Contact()
            {
                Id = 3,
                Address = "Address 3",
                Email = "Email 3",
                FkLanguages = 1,
                Phone = "000-000-000"
            };

            var result = await _restApiController.CreateContactsAsync(entity);

            var list = _restApiController.GetContacts(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetContactsById(3);

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
        public async Task Update_Contact_Entity(int id)
        {
            var entity = await _restApiController.GetContactsById(id);

            entity.Value.Email = "Text 3";

            await _restApiController.UpdateContactsAsync(entity.Value);

            var updateEntity = await _restApiController.GetContactsById(id);

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
        public async Task GetCustomizableProductById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetCustomizableProductsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CustomizableProduct_Entity(int id)
        {
            var result = await _restApiController.DeleteCustomizableProducts(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_CustomizableProduct_Entity()
        {
            var entity = new CustomizableProduct()
            {
                Id = 3,
                FkProducts = 1,
                FkColors = 2,
                FkFabricTypes = 3,
                CustomizationDetails = "Custom Detail 1"
            };

            var result = await _restApiController.CreateCustomizableProductsAsync(entity);

            var list = _restApiController.GetCustomizableProducts(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetCustomizableProductsById(3);

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
        public async Task Update_CustomizableProduct_Entity(int id)
        {
            var entity = await _restApiController.GetCustomizableProductsById(id);

            entity.Value.CustomizationDetails = "Updated Detail";

            await _restApiController.UpdateCustomizableProductsAsync(entity.Value);

            var updateEntity = await _restApiController.GetCustomizableProductsById(id);

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
        public async Task GetCustomizationOrderById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetCustomizationOrdersById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CustomizationOrder_Entity(int id)
        {
            var result = await _restApiController.DeleteCustomizationOrders(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_CustomizationOrder_Entity()
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

            var result = await _restApiController.CreateCustomizationOrdersAsync(entity);

            var list = _restApiController.GetCustomizationOrders(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetCustomizationOrdersById(3);

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
        public async Task Update_CustomizationOrder_Entity(int id)
        {
            var entity = await _restApiController.GetCustomizationOrdersById(id);

            entity.Value.AdditionalNotes = "Updated Note";

            await _restApiController.UpdateCustomizationOrdersAsync(entity.Value);

            var updateEntity = await _restApiController.GetCustomizationOrdersById(id);

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
        public async Task GetFabricTypeById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetFabricTypesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_FabricType_Entity(int id)
        {
            var result = await _restApiController.DeleteFabricTypes(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_FabricType_Entity()
        {
            var entity = new FabricType()
            {
                Id = 3,
                Name = "Silk"
            };

            var result = await _restApiController.CreateFabricTypesAsync(entity);

            var list = _restApiController.GetFabricTypes(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetFabricTypesById(3);

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
        public async Task Update_FabricType_Entity(int id)
        {
            var entity = await _restApiController.GetFabricTypesById(id);

            entity.Value.Name = "Updated Name";

            await _restApiController.UpdateFabricTypesAsync(entity.Value);

            var updateEntity = await _restApiController.GetFabricTypesById(id);

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
        public async Task GetLanguageById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetLanguagesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Language_Entity(int id)
        {
            var result = await _restApiController.DeleteLanguages(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Language_Entity()
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

            var result = await _restApiController.CreateLanguagesAsync(entity);

            var list = _restApiController.GetLanguages(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetLanguagesById(3);

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
        public async Task Update_Language_Entity(int id)
        {
            var entity = await _restApiController.GetLanguagesById(id);

            entity.Value.FullName = "Text 3";

            await _restApiController.UpdateLanguagesAsync(entity.Value);

            var updateEntity = await _restApiController.GetLanguagesById(id);

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
        public async Task GetOrderById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetOrdersById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Order_Entity(int id)
        {
            var result = await _restApiController.DeleteOrders(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Order_Entity()
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

            var result = await _restApiController.CreateOrdersAsync(entity);

            var list = _restApiController.GetOrders(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetOrdersById(3);

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
        public async Task Update_Order_Entity(int id)
        {
            var entity = await _restApiController.GetOrdersById(id);

            entity.Value.TotalAmount = 200.75M;

            await _restApiController.UpdateOrdersAsync(entity.Value);

            var updateEntity = await _restApiController.GetOrdersById(id);

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
            var result = _restApiController.GetOrderHistory(_limit, _page);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result.Value as List<OrderHistory>, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetOrderHistoryById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetOrderHistoryById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_OrderHistory_Entity(int id)
        {
            var result = await _restApiController.DeleteOrderHistory(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_OrderHistory_Entity()
        {
            var entity = new OrderHistory()
            {
                Id = 3,
                FkOrders = 1,
                Status = 1,
                ChangedAt = DateTime.Now
            };

            var result = await _restApiController.CreateOrderHistoryAsync(entity);

            var list = _restApiController.GetOrderHistory(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetOrderHistoryById(3);

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
        public async Task Update_OrderHistory_Entity(int id)
        {
            var entity = await _restApiController.GetOrderHistoryById(id);

            entity.Value.Status = 3;

            await _restApiController.UpdateOrderHistoryAsync(entity.Value);

            var updateEntity = await _restApiController.GetOrderHistoryById(id);

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
        public async Task GetOrderStatusById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetOrderStatusesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_OrderStatus_Entity(int id)
        {
            var result = await _restApiController.DeleteOrderStatuses(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_OrderStatus_Entity()
        {
            var entity = new OrderStatus()
            {
                Id = 3,
                Status = "New Order"
            };

            var result = await _restApiController.CreateOrderStatusesAsync(entity);

            var list = _restApiController.GetOrderStatuses(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetOrderStatusesById(3);

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
        public async Task Update_OrderStatus_Entity(int id)
        {
            var entity = await _restApiController.GetOrderStatusesById(id);

            entity.Value.Status = "Updated Status";

            await _restApiController.UpdateOrderStatusesAsync(entity.Value);

            var updateEntity = await _restApiController.GetOrderStatusesById(id);

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
        public async Task GetPaymentById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetPaymentsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Payment_Entity(int id)
        {
            var result = await _restApiController.DeletePayments(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Payment_Entity()
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

            var result = await _restApiController.CreatePaymentsAsync(entity);

            var list = _restApiController.GetPayments(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetPaymentsById(3);

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
        public async Task Update_Payment_Entity(int id)
        {
            var entity = await _restApiController.GetPaymentsById(id);

            entity.Value.Status = "Pending";

            await _restApiController.UpdatePaymentsAsync(entity.Value);

            var updateEntity = await _restApiController.GetPaymentsById(id);

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
        public async Task GetProductById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetProductsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Product_Entity(int id)
        {
            var result = await _restApiController.DeleteProducts(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Product_Entity()
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

            var result = await _restApiController.CreateProductsAsync(entity);

            var list = _restApiController.GetProducts(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetProductsById(3);

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
        public async Task Update_Product_Entity(int id)
        {
            var entity = await _restApiController.GetProductsById(id);

            entity.Value.Price = 29.99m;

            await _restApiController.UpdateProductsAsync(entity.Value);

            var updateEntity = await _restApiController.GetProductsById(id);

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
        public async Task GetProductImageById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetProductImagesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_ProductImage_Entity(int id)
        {
            var result = await _restApiController.DeleteProductImages(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_ProductImage_Entity()
        {
            var entity = new ProductImage()
            {
                Id = 3,
                FkProducts = 1,
                ImageData = Encoding.ASCII.GetBytes("https://example.com/image3.jpg")
            };

            var result = await _restApiController.CreateProductImagesAsync(entity);

            var list = _restApiController.GetProductImages(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetProductImagesById(3);

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
        public async Task Update_ProductImage_Entity(int id)
        {
            var entity = await _restApiController.GetProductImagesById(id);

            entity.Value.ImageData = Encoding.ASCII.GetBytes("https://example.com/updated_image.jpg");

            await _restApiController.UpdateProductImagesAsync(entity.Value);

            var updateEntity = await _restApiController.GetProductImagesById(id);

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
        public async Task GetProductTranslationById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetProductTranslationsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_ProductTranslation_Entity(int id)
        {
            var result = await _restApiController.DeleteProductTranslations(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_ProductTranslation_Entity()
        {
            var entity = new ProductTranslation()
            {
                Id = 3,
                FkLanguages = 1,
                FkProducts = 1,               
                Name = "Product 3",
                Description = "Description for Product 3"
            };

            var result = await _restApiController.CreateProductTranslationsAsync(entity);

            var list = _restApiController.GetProductTranslations(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetProductTranslationsById(3);

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
        public async Task Update_ProductTranslation_Entity(int id)
        {
            var entity = await _restApiController.GetProductTranslationsById(id);

            entity.Value.Name = "Updated Product Name";

            await _restApiController.UpdateProductTranslationsAsync(entity.Value);

            var updateEntity = await _restApiController.GetProductTranslationsById(id);

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
        public async Task GetReviewById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetReviewsById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Review_Entity(int id)
        {
            var result = await _restApiController.DeleteReviews(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_Review_Entity()
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

            var result = await _restApiController.CreateReviewsAsync(entity);

            var list = _restApiController.GetReviews(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetReviewsById(3);

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
        public async Task Update_Review_Entity(int id)
        {
            var entity = await _restApiController.GetReviewsById(id);

            entity.Value.Comment = "Updated comment.";

            await _restApiController.UpdateReviewsAsync(entity.Value);

            var updateEntity = await _restApiController.GetReviewsById(id);

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
        public async Task GetUserById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetUsersById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });            
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_User_Entity(int id)
        {
            var result = await _restApiController.DeleteUsers(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_User_Entity()
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

            var result = await _restApiController.CreateUsersAsync(entity);

            var list = _restApiController.GetUsers(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetUsersById(3);

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
        public async Task Update_User_Entity(int id)
        {
            var entity = await _restApiController.GetUsersById(id);

            entity.Value.Email = "Text 3";

            await _restApiController.UpdateUsersAsync(entity.Value);

            var updateEntity = await _restApiController.GetUsersById(id);

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
        public async Task GetUserProfileById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetUserProfilesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_UserProfile_Entity(int id)
        {
            var result = await _restApiController.DeleteUserProfiles(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_UserProfile_Entity()
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

            var result = await _restApiController.CreateUserProfilesAsync(entity);

            var list = _restApiController.GetUserProfiles(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetUserProfilesById(3);

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
        public async Task Update_UserProfile_Entity(int id)
        {
            var entity = await _restApiController.GetUserProfilesById(id);

            entity.Value.LastName = "Text 3";

            await _restApiController.UpdateUserProfilesAsync(entity.Value);

            var updateEntity = await _restApiController.GetUserProfilesById(id);

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
        public async Task GetUserRoleById_Return_Correct_Entity(int id)
        {
            var result = await _restApiController.GetUserRolesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Value?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_UserRole_Entity(int id)
        {
            var result = await _restApiController.DeleteUserRoles(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Is.InstanceOf<OkResult>());
            });
        }

        [Test]
        public async Task Add_UserRole_Entity()
        {
            var entity = new UserRole()
            {
                Id = 3,
                FkAccessLevels = 1,
                Name = "Name 3"
            };

            var result = await _restApiController.CreateUserRolesAsync(entity);

            var list = _restApiController.GetUserRoles(_limit, _page);
            var entityThatWasAdded = await _restApiController.GetUserRolesById(3);

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
        public async Task Update_UserRole_Entity(int id)
        {
            var entity = await _restApiController.GetUserRolesById(id);

            entity.Value.Name = "Text 3";

            await _restApiController.UpdateUserRolesAsync(entity.Value);

            var updateEntity = await _restApiController.GetUserRolesById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updateEntity?.Value?.Name, Is.EqualTo(entity.Value.Name));
                Assert.That(entity?.Value?.Name, Is.EqualTo(updateEntity?.Value?.Name));
            });
        }

        #endregion
    }
}
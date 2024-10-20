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
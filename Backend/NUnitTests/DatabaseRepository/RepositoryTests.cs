﻿using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using NUnitTests.Classes;
using Moq;
using DatabaseProvider.Models;
using DatabaseRepository.Classes;
using DatabaseRepository.Interfaces;

namespace NUnitTests.DatabaseRepository
{
    public class RepositoryTests
    {
        private Mock<ILogger<LainLotContext>> _contextLogger;
        private LainLotContext? _context;
        // Fake loggers
        private Mock<ILogger<Repository<About>>> _aboutLogger;
        private Mock<ILogger<Repository<AccessLevel>>> _accessLevelLogger;
        private Mock<ILogger<Repository<Cart>>> _cartLogger;
        private Mock<ILogger<Repository<Category>>> _categoryLogger;
        private Mock<ILogger<Repository<CategoryHierarchy>>> _categoryHierarchyLogger;
        private Mock<ILogger<Repository<Color>>> _colorLogger;
        private Mock<ILogger<Repository<Contact>>> _contactLogger;
        private Mock<ILogger<Repository<CustomizableProduct>>> _customizableProductLogger;
        private Mock<ILogger<Repository<CustomizationOrder>>> _customizationOrderLogger;
        private Mock<ILogger<Repository<FabricType>>> _fabricTypeLogger;
        private Mock<ILogger<Repository<Language>>> _languageLogger;
        private Mock<ILogger<Repository<Order>>> _orderLogger;
        private Mock<ILogger<Repository<OrderHistory>>> _orderHistoryLogger;
        private Mock<ILogger<Repository<OrderStatus>>> _orderStatusLogger;
        private Mock<ILogger<Repository<Payment>>> _paymentLogger;
        private Mock<ILogger<Repository<Product>>> _productLogger;
        private Mock<ILogger<Repository<ProductImage>>> _productImageLogger;
        private Mock<ILogger<Repository<ProductTranslation>>> _productTranslationLogger;
        private Mock<ILogger<Repository<Review>>> _reviewLogger;
        private Mock<ILogger<Repository<User>>> _userLogger;
        private Mock<ILogger<Repository<UserProfile>>> _userProfileLogger;
        private Mock<ILogger<Repository<UserRole>>> _userRoleLogger;
        // Repositories
        private IRepository<About>? _aboutRepository;
        private IRepository<AccessLevel>? _accessLevelRepository;
        private IRepository<Cart>? _cartRepository;
        private IRepository<Category>? _categoryRepository;
        private IRepository<CategoryHierarchy>? _categoryHierarchyRepository;
        private IRepository<Color>? _colorRepository;
        private IRepository<Contact>? _contactRepository;
        private IRepository<CustomizableProduct>? _customizableProductRepository;
        private IRepository<CustomizationOrder>? _customizationOrderRepository;
        private IRepository<FabricType>? _fabricTypeRepository;
        private IRepository<Language>? _languageRepository;
        private IRepository<Order>? _orderRepository;
        private IRepository<OrderHistory>? _orderHistoryRepository;
        private IRepository<OrderStatus>? _orderStatusRepository;
        private IRepository<Payment>? _paymentRepository;
        private IRepository<Product>? _productRepository;
        private IRepository<ProductImage>? _productImageRepository;
        private IRepository<ProductTranslation>? _productTranslationRepository;
        private IRepository<Review>? _reviewRepository;
        private IRepository<User>? _userRepository;
        private IRepository<UserProfile>? _userProfileRepository;
        private IRepository<UserRole>? _userRoleRepository;


        [SetUp]
        public void Setup()
        {
            _contextLogger = new Mock<ILogger<LainLotContext>>();

            var options = new DbContextOptionsBuilder<LainLotContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .EnableSensitiveDataLogging()
                .Options;

            // Create a fake DbContext
            _context = new LainLotContext(options, _contextLogger.Object);

            // Create fake loggers
            _aboutLogger = new Mock<ILogger<Repository<About>>>();
            _accessLevelLogger = new Mock<ILogger<Repository<AccessLevel>>>();
            _cartLogger = new Mock<ILogger<Repository<Cart>>>();
            _categoryLogger = new Mock<ILogger<Repository<Category>>>();
            _categoryHierarchyLogger = new Mock<ILogger<Repository<CategoryHierarchy>>>();
            _colorLogger = new Mock<ILogger<Repository<Color>>>();
            _contactLogger = new Mock<ILogger<Repository<Contact>>>();
            _customizableProductLogger = new Mock<ILogger<Repository<CustomizableProduct>>>();
            _customizationOrderLogger = new Mock<ILogger<Repository<CustomizationOrder>>>();
            _fabricTypeLogger = new Mock<ILogger<Repository<FabricType>>>();
            _languageLogger = new Mock<ILogger<Repository<Language>>>();
            _orderLogger = new Mock<ILogger<Repository<Order>>>();
            _orderHistoryLogger = new Mock<ILogger<Repository<OrderHistory>>>();
            _orderStatusLogger = new Mock<ILogger<Repository<OrderStatus>>>();
            _paymentLogger = new Mock<ILogger<Repository<Payment>>>();
            _productLogger = new Mock<ILogger<Repository<Product>>>();
            _productImageLogger = new Mock<ILogger<Repository<ProductImage>>>();
            _productTranslationLogger = new Mock<ILogger<Repository<ProductTranslation>>>();
            _reviewLogger = new Mock<ILogger<Repository<Review>>>();
            _userLogger = new Mock<ILogger<Repository<User>>>();
            _userProfileLogger = new Mock<ILogger<Repository<UserProfile>>>();
            _userRoleLogger = new Mock<ILogger<Repository<UserRole>>>();

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

            // Create all instances for repositories
            _aboutRepository = new Repository<About>(_context, _aboutLogger.Object);
            _accessLevelRepository = new Repository<AccessLevel>(_context, _accessLevelLogger.Object);
            _cartRepository = new Repository<Cart>(_context, _cartLogger.Object);
            _categoryRepository = new Repository<Category>(_context, _categoryLogger.Object);
            _categoryHierarchyRepository = new Repository<CategoryHierarchy>(_context, _categoryHierarchyLogger.Object);
            _colorRepository = new Repository<Color>(_context, _colorLogger.Object);
            _contactRepository = new Repository<Contact>(_context, _contactLogger.Object);
            _customizableProductRepository = new Repository<CustomizableProduct>(_context, _customizableProductLogger.Object);
            _customizationOrderRepository = new Repository<CustomizationOrder>(_context, _customizationOrderLogger.Object);
            _fabricTypeRepository = new Repository<FabricType>(_context, _fabricTypeLogger.Object);
            _languageRepository = new Repository<Language>(_context, _languageLogger.Object);
            _orderRepository = new Repository<Order>(_context, _orderLogger.Object);
            _orderHistoryRepository = new Repository<OrderHistory>(_context, _orderHistoryLogger.Object);
            _orderStatusRepository = new Repository<OrderStatus>(_context, _orderStatusLogger.Object);
            _paymentRepository = new Repository<Payment>(_context, _paymentLogger.Object);
            _productRepository = new Repository<Product>(_context, _productLogger.Object);
            _productImageRepository = new Repository<ProductImage>(_context, _productImageLogger.Object);
            _productTranslationRepository = new Repository<ProductTranslation>(_context, _productTranslationLogger.Object);
            _reviewRepository = new Repository<Review>(_context, _reviewLogger.Object);
            _userRepository = new Repository<User>(_context, _userLogger.Object);
            _userProfileRepository = new Repository<UserProfile>(_context, _userProfileLogger.Object);
            _userRoleRepository = new Repository<UserRole>(_context, _userRoleLogger.Object);

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
        public void GetAbout_Return_2_Items()
        {
            var result = _aboutRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetAboutById_Return_Correct_EntityAsync(int id)
        {
            var result = await _aboutRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_About_Entity(int id)
        {
            var result = await _aboutRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _aboutRepository?.Delete(result);
            var count = _aboutRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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

            await _aboutRepository?.Add(entity);

            var list = _aboutRepository?.GetAll().ToList();
            var entityThatWasAdded = await _aboutRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkLanguages, Is.EqualTo(entity?.FkLanguages));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_About_Entity(int id)
        {
            var entity = await _aboutRepository?.GetById(id);

            entity.Text = "Updated Text";

            await _aboutRepository?.Update(entity);

            var updatedEntity = await _aboutRepository?.GetById(id);

            Assert.That(updatedEntity?.Text, Is.EqualTo(entity?.Text));
        }

        #endregion

        #region AccessLevels table

        [Test]
        public void GetAccessLevels_Return_2_Items()
        {
            var result = _accessLevelRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetAccessLevelById_Return_Correct_Entity(int id)
        {
            var result = await _accessLevelRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_AccessLevel_Entity(int id)
        {
            var result = await _accessLevelRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _accessLevelRepository?.Delete(result);
            var count = _accessLevelRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_AccessLevel_Entity()
        {
            var entity = new AccessLevel()
            {
                Id = 3,
                Description = "Access Level 3"
            };

            await _accessLevelRepository?.Add(entity);

            var list = _accessLevelRepository?.GetAll().ToList();
            var entityThatWasAdded = await _accessLevelRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Description, Is.EqualTo(entity?.Description));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_AccessLevel_Entity(int id)
        {
            var entity = await _accessLevelRepository?.GetById(id);

            entity.Description = "Updated Access Level";

            await _accessLevelRepository?.Update(entity);

            var updatedEntity = await _accessLevelRepository?.GetById(id);

            Assert.That(updatedEntity?.Description, Is.EqualTo(entity?.Description));
        }

        #endregion

        #region Carts table

        [Test]
        public void GetCarts_Return_2_Items()
        {
            var result = _cartRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCartById_Return_Correct_Entity(int id)
        {
            var result = await _cartRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Cart_Entity(int id)
        {
            var result = await _cartRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _cartRepository?.Delete(result);
            var count = _cartRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Cart_Entity()
        {
            var entity = new Cart()
            {
                Id = 3,
                FkUsers = 1,
                CreatedAt = DateTime.UtcNow
            };

            await _cartRepository?.Add(entity);

            var list = _cartRepository?.GetAll().ToList();
            var entityThatWasAdded = await _cartRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkUsers, Is.EqualTo(entity?.FkUsers));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Cart_Entity(int id)
        {
            var entity = await _cartRepository?.GetById(id);

            entity.FkUsers = 2;

            await _cartRepository?.Update(entity);

            var updatedEntity = await _cartRepository?.GetById(id);

            Assert.That(updatedEntity?.FkUsers, Is.EqualTo(entity?.FkUsers));
        }

        #endregion

        #region Categories table

        [Test]
        public void GetCategories_Return_2_Items()
        {
            var result = _categoryRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCategoryById_Return_Correct_Entity(int id)
        {
            var result = await _categoryRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Category_Entity(int id)
        {
            var result = await _categoryRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _categoryRepository?.Delete(result);
            var count = _categoryRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Category_Entity()
        {
            var entity = new Category()
            {
                Id = 3,
                FkLanguages = 1,
                Name = "New Category",
                Description = "Description"
            };

            await _categoryRepository?.Add(entity);

            var list = _categoryRepository?.GetAll().ToList();
            var entityThatWasAdded = await _categoryRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Name, Is.EqualTo(entity?.Name));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Category_Entity(int id)
        {
            var entity = await _categoryRepository?.GetById(id);

            entity.Name = "Updated Category";

            await _categoryRepository?.Update(entity);

            var updatedEntity = await _categoryRepository?.GetById(id);

            Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
        }

        #endregion

        #region CategoryHierarchy table

        [Test]
        public void GetCategoryHierarchies_Return_2_Items()
        {
            var result = _categoryHierarchyRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCategoryHierarchyById_Return_Correct_Entity(int id)
        {
            var result = await _categoryHierarchyRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CategoryHierarchy_Entity(int id)
        {
            var result = await _categoryHierarchyRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _categoryHierarchyRepository?.Delete(result);
            var count = _categoryHierarchyRepository?.GetAll().Count();

            if (id == 1)
            {
                Assert.That(count, Is.EqualTo(0));
            }
            else
            {
                Assert.That(count, Is.EqualTo(1));
            }            
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

            await _categoryHierarchyRepository?.Add(entity);

            var list = _categoryHierarchyRepository?.GetAll().ToList();
            var entityThatWasAdded = await _categoryHierarchyRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.ParentId, Is.EqualTo(entity?.ParentId));
                Assert.That(entityThatWasAdded?.FkCategories, Is.EqualTo(entity?.FkCategories));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_CategoryHierarchy_Entity(int id)
        {
            var entity = await _categoryHierarchyRepository?.GetById(id);

            entity.FkCategories = 3;

            await _categoryHierarchyRepository?.Update(entity);

            var updatedEntity = await _categoryHierarchyRepository?.GetById(id);

            Assert.That(updatedEntity?.FkCategories, Is.EqualTo(entity?.FkCategories));
        }

        #endregion

        #region Color table

        [Test]
        public void GetColors_Return_2_Items()
        {
            var result = _colorRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetColorById_Return_Correct_Entity(int id)
        {
            var result = await _colorRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Color_Entity(int id)
        {
            var result = await _colorRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _colorRepository?.Delete(result);
            var count = _colorRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Color_Entity()
        {
            var entity = new Color()
            {
                Id = 3,
                Name = "Blue",
                HexCode = "#0000FF"
            };

            await _colorRepository?.Add(entity);

            var list = _colorRepository?.GetAll().ToList();
            var entityThatWasAdded = await _colorRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Name, Is.EqualTo(entity?.Name));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Color_Entity(int id)
        {
            var entity = await _colorRepository?.GetById(id);

            entity.Name = "Updated Color";

            await _colorRepository?.Update(entity);

            var updatedEntity = await _colorRepository?.GetById(id);

            Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
        }

        #endregion

        #region Contact table

        [Test]
        public void GetContacts_Return_2_Items()
        {
            var result = _contactRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetContactById_Return_Correct_Entity(int id)
        {
            var result = await _contactRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Contact_Entity(int id)
        {
            var result = await _contactRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _contactRepository?.Delete(result);
            var count = _contactRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Contact_Entity()
        {
            var entity = new Contact()
            {
                Id = 3,
                Email = "newcontact@example.com",
                Phone = "123456789",
                Address = "Address"
            };

            await _contactRepository?.Add(entity);

            var list = _contactRepository?.GetAll().ToList();
            var entityThatWasAdded = await _contactRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Email, Is.EqualTo(entity?.Email));
                Assert.That(entityThatWasAdded?.Phone, Is.EqualTo(entity?.Phone));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Contact_Entity(int id)
        {
            var entity = await _contactRepository?.GetById(id);

            entity.Email = "updatedcontact@example.com";
            entity.Phone = "987654321";

            await _contactRepository?.Update(entity);

            var updatedEntity = await _contactRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Email, Is.EqualTo(entity?.Email));
                Assert.That(updatedEntity?.Phone, Is.EqualTo(entity?.Phone));
            });
        }

        #endregion

        #region CustomizableProduct table

        [Test]
        public void GetCustomizableProducts_Return_2_Items()
        {
            var result = _customizableProductRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCustomizableProductById_Return_Correct_Entity(int id)
        {
            var result = await _customizableProductRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CustomizableProduct_Entity(int id)
        {
            var result = await _customizableProductRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _customizableProductRepository?.Delete(result);
            var count = _customizableProductRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_CustomizableProduct_Entity()
        {
            var entity = new CustomizableProduct()
            {
                Id = 3,
                FkProducts = 1,
                CustomizationDetails = "Description of new customizable product",
                FkColors = 1,
                FkFabricTypes = 1,
                SizeOptions = "M"
            };

            await _customizableProductRepository?.Add(entity);

            var list = _customizableProductRepository?.GetAll().ToList();
            var entityThatWasAdded = await _customizableProductRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkProducts, Is.EqualTo(entity?.FkProducts));
                Assert.That(entityThatWasAdded?.CustomizationDetails, Is.EqualTo(entity?.CustomizationDetails));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_CustomizableProduct_Entity(int id)
        {
            var entity = await _customizableProductRepository?.GetById(id);

            entity.FkProducts = 2;
            entity.CustomizationDetails = "Updated description";

            await _customizableProductRepository?.Update(entity);

            var updatedEntity = await _customizableProductRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.FkProducts, Is.EqualTo(entity?.FkProducts));
                Assert.That(updatedEntity?.CustomizationDetails, Is.EqualTo(entity?.CustomizationDetails));
            });
        }

        #endregion

        #region CustomizationOrder table

        [Test]
        public void GetCustomizationOrders_Return_2_Items()
        {
            var result = _customizationOrderRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetCustomizationOrderById_Return_Correct_Entity(int id)
        {
            var result = await _customizationOrderRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_CustomizationOrder_Entity(int id)
        {
            var result = await _customizationOrderRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _customizationOrderRepository?.Delete(result);
            var count = _customizationOrderRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_CustomizationOrder_Entity()
        {
            var entity = new CustomizationOrder()
            {
                Id = 3,
                Size = "M"
            };

            await _customizationOrderRepository?.Add(entity);

            var list = _customizationOrderRepository?.GetAll().ToList();
            var entityThatWasAdded = await _customizationOrderRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Size, Is.EqualTo(entity?.Size));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_CustomizationOrder_Entity(int id)
        {
            var entity = await _customizationOrderRepository?.GetById(id);

            entity.Size = "XL";

            await _customizationOrderRepository?.Update(entity);

            var updatedEntity = await _customizationOrderRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Size, Is.EqualTo(entity?.Size));
            });
        }

        #endregion

        #region FabricType table

        [Test]
        public void GetFabricTypes_Return_2_Items()
        {
            var result = _fabricTypeRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetFabricTypeById_Return_Correct_Entity(int id)
        {
            var result = await _fabricTypeRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_FabricType_Entity(int id)
        {
            var result = await _fabricTypeRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _fabricTypeRepository?.Delete(result);
            var count = _fabricTypeRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_FabricType_Entity()
        {
            var entity = new FabricType()
            {
                Id = 3,
                Name = "Cotton"
            };

            await _fabricTypeRepository?.Add(entity);

            var list = _fabricTypeRepository?.GetAll().ToList();
            var entityThatWasAdded = await _fabricTypeRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Name, Is.EqualTo(entity?.Name));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_FabricType_Entity(int id)
        {
            var entity = await _fabricTypeRepository?.GetById(id);

            entity.Name = "Polyester";

            await _fabricTypeRepository?.Update(entity);

            var updatedEntity = await _fabricTypeRepository?.GetById(id);

            Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
        }

        #endregion

        #region Language table

        [Test]
        public void GetLanguages_Return_2_Items()
        {
            var result = _languageRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetLanguageById_Return_Correct_Entity(int id)
        {
            var result = await _languageRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Language_Entity(int id)
        {
            var result = await _languageRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _languageRepository?.Delete(result);
            var count = _languageRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Language_Entity()
        {
            var entity = new Language()
            {
                Id = 3,
                FullName = "Spanish",
                Abbreviation = "SPA",
                DateFormat = "dd\\mm\\yyyy",
                TimeFormat = "",
                Description = "Description"
            };

            await _languageRepository?.Add(entity);

            var list = _languageRepository?.GetAll().ToList();
            var entityThatWasAdded = await _languageRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FullName, Is.EqualTo(entity?.FullName));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Language_Entity(int id)
        {
            var entity = await _languageRepository?.GetById(id);

            entity.FullName = "French";

            await _languageRepository?.Update(entity);

            var updatedEntity = await _languageRepository?.GetById(id);

            Assert.That(updatedEntity?.FullName, Is.EqualTo(entity?.FullName));
        }

        #endregion

        #region Order table

        [Test]
        public void GetOrders_Return_2_Items()
        {
            var result = _orderRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetOrderById_Return_Correct_Entity(int id)
        {
            var result = await _orderRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Order_Entity(int id)
        {
            var result = await _orderRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _orderRepository?.Delete(result);
            var count = _orderRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Order_Entity()
        {
            var entity = new Order()
            {
                Id = 3,
                FkUsers = 1,
                FkOrderStatus = 1,
                TotalAmount = 100.00M,
                ShippingAddress = "ShippingAddress",
                CreatedAt = DateTime.UtcNow,
                OrderDate = DateTime.UtcNow,
                PaymentStatus = "PaymentStatus",
                ShippingMethod = "ShippingMethod",
                UpdatedAt = DateTime.UtcNow,
                TrackingNumber = "TrackingNumber"
            };

            await _orderRepository?.Add(entity);

            var list = _orderRepository?.GetAll().ToList();
            var entityThatWasAdded = await _orderRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkUsers, Is.EqualTo(entity?.FkUsers));
                Assert.That(entityThatWasAdded?.FkOrderStatus, Is.EqualTo(entity?.FkOrderStatus));
                Assert.That(entityThatWasAdded?.TotalAmount, Is.EqualTo(entity?.TotalAmount));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Order_Entity(int id)
        {
            var entity = await _orderRepository?.GetById(id);

            entity.TotalAmount = 200.00M;

            await _orderRepository?.Update(entity);

            var updatedEntity = await _orderRepository?.GetById(id);

            Assert.That(updatedEntity?.TotalAmount, Is.EqualTo(entity?.TotalAmount));
        }

        #endregion

        #region OrderHistory table

        [Test]
        public void GetOrderHistories_Return_2_Items()
        {
            var result = _orderHistoryRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetOrderHistoryById_Return_Correct_Entity(int id)
        {
            var result = await _orderHistoryRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_OrderHistory_Entity(int id)
        {
            var result = await _orderHistoryRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _orderHistoryRepository?.Delete(result);
            var count = _orderHistoryRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_OrderHistory_Entity()
        {
            var entity = new OrderHistory()
            {
                Id = 3,
                FkOrders = 1,
                FkOrderStatuses = 1,
                ChangedAt = DateTime.Now
            };

            await _orderHistoryRepository?.Add(entity);

            var list = _orderHistoryRepository?.GetAll().ToList();
            var entityThatWasAdded = await _orderHistoryRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkOrderStatuses, Is.EqualTo(entity?.FkOrderStatuses));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_OrderHistory_Entity(int id)
        {
            var entity = await _orderHistoryRepository?.GetById(id);

            entity.FkOrderStatuses = 2;

            await _orderHistoryRepository?.Update(entity);

            var updatedEntity = await _orderHistoryRepository?.GetById(id);

            Assert.That(updatedEntity?.FkOrderStatuses, Is.EqualTo(entity?.FkOrderStatuses));
        }

        #endregion

        #region OrderStatus table

        [Test]
        public void GetOrderStatuses_Return_2_Items()
        {
            var result = _orderStatusRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetOrderStatusById_Return_Correct_Entity(int id)
        {
            var result = await _orderStatusRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_OrderStatus_Entity(int id)
        {
            var result = await _orderStatusRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _orderStatusRepository?.Delete(result);
            var count = _orderStatusRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_OrderStatus_Entity()
        {
            var entity = new OrderStatus()
            {
                Id = 3,
                Status = "Cancelled"
            };

            await _orderStatusRepository?.Add(entity);

            var list = _orderStatusRepository?.GetAll().ToList();
            var entityThatWasAdded = await _orderStatusRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Status, Is.EqualTo(entity?.Status));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_OrderStatus_Entity(int id)
        {
            var entity = await _orderStatusRepository?.GetById(id);

            entity.Status = "Shipped";

            await _orderStatusRepository?.Update(entity);

            var updatedEntity = await _orderStatusRepository?.GetById(id);

            Assert.That(updatedEntity?.Status, Is.EqualTo(entity?.Status));
        }

        #endregion

        #region Payment table

        [Test]
        public void GetPayments_Return_2_Items()
        {
            var result = _paymentRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetPaymentById_Return_Correct_Entity(int id)
        {
            var result = await _paymentRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Payment_Entity(int id)
        {
            var result = await _paymentRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _paymentRepository?.Delete(result);
            var count = _paymentRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Payment_Entity()
        {
            var entity = new Payment()
            {
                Id = 3,
                PaymentMethod = "Credit Card",
                Status = "Status",
                Amount = 10
            };

            await _paymentRepository?.Add(entity);

            var list = _paymentRepository?.GetAll().ToList();
            var entityThatWasAdded = await _paymentRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.PaymentMethod, Is.EqualTo(entity?.PaymentMethod));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Payment_Entity(int id)
        {
            var entity = await _paymentRepository?.GetById(id);

            entity.PaymentMethod = "PayPal";

            await _paymentRepository?.Update(entity);

            var updatedEntity = await _paymentRepository?.GetById(id);

            Assert.That(updatedEntity?.PaymentMethod, Is.EqualTo(entity?.PaymentMethod));
        }

        #endregion

        #region Product table

        [Test]
        public void GetProducts_Return_2_Items()
        {
            var result = _productRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetProductById_Return_Correct_Entity(int id)
        {
            var result = await _productRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Product_Entity(int id)
        {
            var result = await _productRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _productRepository?.Delete(result);
            var count = _productRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_Product_Entity()
        {
            var entity = new Product()
            {
                Id = 3,
                Price = 99.99m,
                IsActive = true,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                IsCustomizable = true,
                StockQuantity = 1
            };

            await _productRepository?.Add(entity);

            var list = _productRepository?.GetAll().ToList();
            var entityThatWasAdded = await _productRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Price, Is.EqualTo(entity?.Price));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Product_Entity(int id)
        {
            var entity = await _productRepository?.GetById(id);

            entity.Price = 199.99m;

            await _productRepository?.Update(entity);

            var updatedEntity = await _productRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Price, Is.EqualTo(entity?.Price));
            });
        }

        #endregion

        #region ProductImage table

        [Test]
        public void GetProductImages_Return_2_Items()
        {
            var result = _productImageRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetProductImageById_Return_Correct_Entity(int id)
        {
            var result = await _productImageRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_ProductImage_Entity(int id)
        {
            var result = await _productImageRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _productImageRepository?.Delete(result);
            var count = _productImageRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_ProductImage_EntityAsync()
        {
            var entity = new ProductImage()
            {
                Id = 3,
                FkProducts = 1,
                ImageData = Encoding.ASCII.GetBytes("https://example.com/image1.jpg")
            };

            await _productImageRepository?.Add(entity);

            var list = _productImageRepository?.GetAll().ToList();
            var entityThatWasAdded = await _productImageRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_ProductImage_Entity(int id)
        {
            var entity = await _productImageRepository?.GetById(id);

            entity.ImageData = Encoding.UTF8.GetBytes("http://example.com/updated-image.jpg");

            await _productImageRepository?.Update(entity);

            var updatedEntity = await _productImageRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.ImageData, Is.EqualTo(entity?.ImageData));
            });
        }

        #endregion

        #region ProductTranslation table

        [Test]
        public void GetProductTranslations_Return_2_Items()
        {
            var result = _productTranslationRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetProductTranslationById_Return_Correct_Entity(int id)
        {
            var result = await _productTranslationRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_ProductTranslation_Entity(int id)
        {
            var result = await _productTranslationRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _productTranslationRepository?.Delete(result);
            var count = _productTranslationRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_ProductTranslation_Entity()
        {
            var entity = new ProductTranslation()
            {
                Id = 3,
                FkProducts = 1,
                FkLanguages = 1,
                Name = "New Product",
                Description = "Description of new product"
            };

            await _productTranslationRepository?.Add(entity);

            var list = _productTranslationRepository?.GetAll().ToList();
            var entityThatWasAdded = await _productTranslationRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Name, Is.EqualTo(entity?.Name));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_ProductTranslation_Entity(int id)
        {
            var entity = await _productTranslationRepository?.GetById(id);

            entity.Name = "Updated Title";

            await _productTranslationRepository?.Update(entity);

            var updatedEntity = await _productTranslationRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
            });
        }

        #endregion

        #region Review table

        [Test]
        public void GetReviews_Return_2_Items()
        {
            var result = _reviewRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetReviewById_Return_Correct_Entity(int id)
        {
            var result = await _reviewRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_Review_Entity(int id)
        {
            var result = await _reviewRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _reviewRepository?.Delete(result);
            var count = _reviewRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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
                Comment = "Excellent product!"
            };

            await _reviewRepository?.Add(entity);

            var list = _reviewRepository?.GetAll().ToList();
            var entityThatWasAdded = await _reviewRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Comment, Is.EqualTo(entity?.Comment));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_Review_Entity(int id)
        {
            var entity = await _reviewRepository?.GetById(id);

            entity.Rating = 4;

            await _reviewRepository?.Update(entity);

            var updatedEntity = await _reviewRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Rating, Is.EqualTo(entity?.Rating));
            });
        }

        #endregion

        #region User table

        [Test]
        public void GetUsers_Return_2_Items()
        {
            var result = _userRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetUserById_Return_Correct_Entity(int id)
        {
            var result = await _userRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_User_Entity(int id)
        {
            var result = await _userRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _userRepository?.Delete(result);
            var count = _userRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_User_Entity()
        {
            var entity = new User()
            {
                Id = 3,
                Login = "new_user",
                Hash = "hashed_password",
                Email = "new_user@example.com",
                FkUserRoles = 1,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Password = "Password",
                ConfirmEmail = 0
            };

            await _userRepository?.Add(entity);

            var list = _userRepository?.GetAll().ToList();
            var entityThatWasAdded = await _userRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Login, Is.EqualTo(entity?.Login));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_User_Entity(int id)
        {
            var entity = await _userRepository?.GetById(id);

            entity.Email = "updated_email@example.com";

            await _userRepository?.Update(entity);

            var updatedEntity = await _userRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Email, Is.EqualTo(entity?.Email));
            });
        }

        #endregion

        #region UserProfile table

        [Test]
        public void GetUserProfiles_Return_2_Items()
        {
            var result = _userProfileRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetUserProfileById_Return_Correct_Entity(int id)
        {
            var result = await _userProfileRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_UserProfile_Entity(int id)
        {
            var result = await _userProfileRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _userProfileRepository?.Delete(result);
            var count = _userProfileRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_UserProfile_Entity()
        {
            var entity = new UserProfile()
            {
                Id = 3,
                FkUsers = 1,
                FirstName = "John",
                LastName = "Doe",
                Phone = "123456789"
            };

            await _userProfileRepository?.Add(entity);

            var list = _userProfileRepository?.GetAll().ToList();
            var entityThatWasAdded = await _userProfileRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FirstName, Is.EqualTo(entity?.FirstName));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_UserProfile_Entity(int id)
        {
            var entity = await _userProfileRepository?.GetById(id);

            entity.LastName = "UpdatedLastName";

            await _userProfileRepository?.Update(entity);

            var updatedEntity = await _userProfileRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.LastName, Is.EqualTo(entity?.LastName));
            });
        }

        #endregion

        #region UserRole table

        [Test]
        public void GetUserRoles_Return_2_Items()
        {
            var result = _userRoleRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task GetUserRoleById_Return_Correct_Entity(int id)
        {
            var result = await _userRoleRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Delete_UserRole_Entity(int id)
        {
            var result = await _userRoleRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            await _userRoleRepository?.Delete(result);
            var count = _userRoleRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task Add_UserRole_Entity()
        {
            var entity = new UserRole()
            {
                Id = 3,
                Name = "NewRole"
            };

            await _userRoleRepository?.Add(entity);

            var list = _userRoleRepository?.GetAll().ToList();
            var entityThatWasAdded = await _userRoleRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Name, Is.EqualTo(entity?.Name));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Update_UserRole_Entity(int id)
        {
            var entity = await _userRoleRepository?.GetById(id);

            entity.Name = "UpdatedRoleName";

            await _userRoleRepository?.Update(entity);

            var updatedEntity = await _userRoleRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
            });
        }

        #endregion
    }
}
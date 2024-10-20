using NUnitTests.Classes;
using Microsoft.EntityFrameworkCore;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using DatabaseRepository.Classes;
using System.Text;

namespace NUnitTests.DatabaseRepository
{
    public class RepositoryTests
    {
        private DbContextFake? _context;
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
            var options = new DbContextOptionsBuilder<DbContextFake>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            // Create a fake DbContext
            _context = new DbContextFake(options);

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

            _aboutRepository = new Repository<About>(_context);
            _accessLevelRepository = new Repository<AccessLevel>(_context);
            _cartRepository = new Repository<Cart>(_context);
            _categoryRepository = new Repository<Category>(_context);
            _categoryHierarchyRepository = new Repository<CategoryHierarchy>(_context);
            _colorRepository = new Repository<Color>(_context);
            _contactRepository = new Repository<Contact>(_context);
            _customizableProductRepository = new Repository<CustomizableProduct>(_context);
            _customizationOrderRepository = new Repository<CustomizationOrder>(_context);
            _fabricTypeRepository = new Repository<FabricType>(_context);
            _languageRepository = new Repository<Language>(_context);
            _orderRepository = new Repository<Order>(_context);
            _orderHistoryRepository = new Repository<OrderHistory>(_context);
            _orderStatusRepository = new Repository<OrderStatus>(_context);
            _paymentRepository = new Repository<Payment>(_context);
            _productRepository = new Repository<Product>(_context);
            _productImageRepository = new Repository<ProductImage>(_context);
            _productTranslationRepository = new Repository<ProductTranslation>(_context);
            _reviewRepository = new Repository<Review>(_context);
            _userRepository = new Repository<User>(_context);
            _userProfileRepository = new Repository<UserProfile>(_context);
            _userRoleRepository = new Repository<UserRole>(_context);
        }


        [TearDown]
        public void FinishTest()
        {
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
        public void GetAboutById_Return_Correct_Entity(int id)
        {
            var result = _aboutRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_About_Entity(int id)
        {
            var result = _aboutRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _aboutRepository?.Delete(result);
            var count = _aboutRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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

            _aboutRepository?.Add(entity);

            var list = _aboutRepository?.GetAll().ToList();
            var entityThatWasAdded = _aboutRepository?.GetById(3);

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
        public void Update_About_Entity(int id)
        {
            var entity = _aboutRepository?.GetById(id);

            entity.Text = "Updated Text";

            _aboutRepository?.Update(entity);

            var updatedEntity = _aboutRepository?.GetById(id);

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
        public void GetAccessLevelById_Return_Correct_Entity(int id)
        {
            var result = _accessLevelRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_AccessLevel_Entity(int id)
        {
            var result = _accessLevelRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _accessLevelRepository?.Delete(result);
            var count = _accessLevelRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_AccessLevel_Entity()
        {
            var entity = new AccessLevel()
            {
                Id = 3,
                Description = "Access Level 3"
            };

            _accessLevelRepository?.Add(entity);

            var list = _accessLevelRepository?.GetAll().ToList();
            var entityThatWasAdded = _accessLevelRepository?.GetById(3);

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
        public void Update_AccessLevel_Entity(int id)
        {
            var entity = _accessLevelRepository?.GetById(id);

            entity.Description = "Updated Access Level";

            _accessLevelRepository?.Update(entity);

            var updatedEntity = _accessLevelRepository?.GetById(id);

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
        public void GetCartById_Return_Correct_Entity(int id)
        {
            var result = _cartRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Cart_Entity(int id)
        {
            var result = _cartRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _cartRepository?.Delete(result);
            var count = _cartRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Cart_Entity()
        {
            var entity = new Cart()
            {
                Id = 3,
                FkUsers = 1,
                CreatedAt = DateTime.UtcNow
            };

            _cartRepository?.Add(entity);

            var list = _cartRepository?.GetAll().ToList();
            var entityThatWasAdded = _cartRepository?.GetById(3);

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
        public void Update_Cart_Entity(int id)
        {
            var entity = _cartRepository?.GetById(id);

            entity.FkUsers = 2;

            _cartRepository?.Update(entity);

            var updatedEntity = _cartRepository?.GetById(id);

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
        public void GetCategoryById_Return_Correct_Entity(int id)
        {
            var result = _categoryRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Category_Entity(int id)
        {
            var result = _categoryRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _categoryRepository?.Delete(result);
            var count = _categoryRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Category_Entity()
        {
            var entity = new Category()
            {
                Id = 3,
                FkLanguages = 1,
                Name = "New Category",
                Description = "Description"
            };

            _categoryRepository?.Add(entity);

            var list = _categoryRepository?.GetAll().ToList();
            var entityThatWasAdded = _categoryRepository?.GetById(3);

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
        public void Update_Category_Entity(int id)
        {
            var entity = _categoryRepository?.GetById(id);

            entity.Name = "Updated Category";

            _categoryRepository?.Update(entity);

            var updatedEntity = _categoryRepository?.GetById(id);

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
        public void GetCategoryHierarchyById_Return_Correct_Entity(int id)
        {
            var result = _categoryHierarchyRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CategoryHierarchy_Entity(int id)
        {
            var result = _categoryHierarchyRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _categoryHierarchyRepository?.Delete(result);
            var count = _categoryHierarchyRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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

            _categoryHierarchyRepository?.Add(entity);

            var list = _categoryHierarchyRepository?.GetAll().ToList();
            var entityThatWasAdded = _categoryHierarchyRepository?.GetById(3);

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
        public void Update_CategoryHierarchy_Entity(int id)
        {
            var entity = _categoryHierarchyRepository?.GetById(id);

            entity.FkCategories = 3;

            _categoryHierarchyRepository?.Update(entity);

            var updatedEntity = _categoryHierarchyRepository?.GetById(id);

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
        public void GetColorById_Return_Correct_Entity(int id)
        {
            var result = _colorRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Color_Entity(int id)
        {
            var result = _colorRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _colorRepository?.Delete(result);
            var count = _colorRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Color_Entity()
        {
            var entity = new Color()
            {
                Id = 3,
                Name = "Blue",
                HexCode = "#0000FF"
            };

            _colorRepository?.Add(entity);

            var list = _colorRepository?.GetAll().ToList();
            var entityThatWasAdded = _colorRepository?.GetById(3);

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
        public void Update_Color_Entity(int id)
        {
            var entity = _colorRepository?.GetById(id);

            entity.Name = "Updated Color";

            _colorRepository?.Update(entity);

            var updatedEntity = _colorRepository?.GetById(id);

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
        public void GetContactById_Return_Correct_Entity(int id)
        {
            var result = _contactRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Contact_Entity(int id)
        {
            var result = _contactRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _contactRepository?.Delete(result);
            var count = _contactRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Contact_Entity()
        {
            var entity = new Contact()
            {
                Id = 3,
                Email = "newcontact@example.com",
                Phone = "123456789",
                Address = "Address"
            };

            _contactRepository?.Add(entity);

            var list = _contactRepository?.GetAll().ToList();
            var entityThatWasAdded = _contactRepository?.GetById(3);

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
        public void Update_Contact_Entity(int id)
        {
            var entity = _contactRepository?.GetById(id);

            entity.Email = "updatedcontact@example.com";
            entity.Phone = "987654321";

            _contactRepository?.Update(entity);

            var updatedEntity = _contactRepository?.GetById(id);

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
        public void GetCustomizableProductById_Return_Correct_Entity(int id)
        {
            var result = _customizableProductRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CustomizableProduct_Entity(int id)
        {
            var result = _customizableProductRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _customizableProductRepository?.Delete(result);
            var count = _customizableProductRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_CustomizableProduct_Entity()
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

            _customizableProductRepository?.Add(entity);

            var list = _customizableProductRepository?.GetAll().ToList();
            var entityThatWasAdded = _customizableProductRepository?.GetById(3);

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
        public void Update_CustomizableProduct_Entity(int id)
        {
            var entity = _customizableProductRepository?.GetById(id);

            entity.FkProducts = 2;
            entity.CustomizationDetails = "Updated description";

            _customizableProductRepository?.Update(entity);

            var updatedEntity = _customizableProductRepository?.GetById(id);

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
        public void GetCustomizationOrderById_Return_Correct_Entity(int id)
        {
            var result = _customizationOrderRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_CustomizationOrder_Entity(int id)
        {
            var result = _customizationOrderRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _customizationOrderRepository?.Delete(result);
            var count = _customizationOrderRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_CustomizationOrder_Entity()
        {
            var entity = new CustomizationOrder()
            {
                Id = 3,
                Size = "M"
            };

            _customizationOrderRepository?.Add(entity);

            var list = _customizationOrderRepository?.GetAll().ToList();
            var entityThatWasAdded = _customizationOrderRepository?.GetById(3);

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
        public void Update_CustomizationOrder_Entity(int id)
        {
            var entity = _customizationOrderRepository?.GetById(id);

            entity.Size = "XL";

            _customizationOrderRepository?.Update(entity);

            var updatedEntity = _customizationOrderRepository?.GetById(id);

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
        public void GetFabricTypeById_Return_Correct_Entity(int id)
        {
            var result = _fabricTypeRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_FabricType_Entity(int id)
        {
            var result = _fabricTypeRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _fabricTypeRepository?.Delete(result);
            var count = _fabricTypeRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_FabricType_Entity()
        {
            var entity = new FabricType()
            {
                Id = 3,
                Name = "Cotton"
            };

            _fabricTypeRepository?.Add(entity);

            var list = _fabricTypeRepository?.GetAll().ToList();
            var entityThatWasAdded = _fabricTypeRepository?.GetById(3);

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
        public void Update_FabricType_Entity(int id)
        {
            var entity = _fabricTypeRepository?.GetById(id);

            entity.Name = "Polyester";

            _fabricTypeRepository?.Update(entity);

            var updatedEntity = _fabricTypeRepository?.GetById(id);

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
        public void GetLanguageById_Return_Correct_Entity(int id)
        {
            var result = _languageRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Language_Entity(int id)
        {
            var result = _languageRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _languageRepository?.Delete(result);
            var count = _languageRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Language_Entity()
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

            _languageRepository?.Add(entity);

            var list = _languageRepository?.GetAll().ToList();
            var entityThatWasAdded = _languageRepository?.GetById(3);

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
        public void Update_Language_Entity(int id)
        {
            var entity = _languageRepository?.GetById(id);

            entity.FullName = "French";

            _languageRepository?.Update(entity);

            var updatedEntity = _languageRepository?.GetById(id);

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
        public void GetOrderById_Return_Correct_Entity(int id)
        {
            var result = _orderRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Order_Entity(int id)
        {
            var result = _orderRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _orderRepository?.Delete(result);
            var count = _orderRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Order_Entity()
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

            _orderRepository?.Add(entity);

            var list = _orderRepository?.GetAll().ToList();
            var entityThatWasAdded = _orderRepository?.GetById(3);

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
        public void Update_Order_Entity(int id)
        {
            var entity = _orderRepository?.GetById(id);

            entity.TotalAmount = 200.00M;

            _orderRepository?.Update(entity);

            var updatedEntity = _orderRepository?.GetById(id);

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
        public void GetOrderHistoryById_Return_Correct_Entity(int id)
        {
            var result = _orderHistoryRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_OrderHistory_Entity(int id)
        {
            var result = _orderHistoryRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _orderHistoryRepository?.Delete(result);
            var count = _orderHistoryRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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

            _orderHistoryRepository?.Add(entity);

            var list = _orderHistoryRepository?.GetAll().ToList();
            var entityThatWasAdded = _orderHistoryRepository?.GetById(3);

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
        public void Update_OrderHistory_Entity(int id)
        {
            var entity = _orderHistoryRepository?.GetById(id);

            entity.Status = 2;

            _orderHistoryRepository?.Update(entity);

            var updatedEntity = _orderHistoryRepository?.GetById(id);

            Assert.That(updatedEntity?.Status, Is.EqualTo(entity?.Status));
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
        public void GetOrderStatusById_Return_Correct_Entity(int id)
        {
            var result = _orderStatusRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_OrderStatus_Entity(int id)
        {
            var result = _orderStatusRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _orderStatusRepository?.Delete(result);
            var count = _orderStatusRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_OrderStatus_Entity()
        {
            var entity = new OrderStatus()
            {
                Id = 3,
                Status = "Cancelled"
            };

            _orderStatusRepository?.Add(entity);

            var list = _orderStatusRepository?.GetAll().ToList();
            var entityThatWasAdded = _orderStatusRepository?.GetById(3);

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
        public void Update_OrderStatus_Entity(int id)
        {
            var entity = _orderStatusRepository?.GetById(id);

            entity.Status = "Shipped";

            _orderStatusRepository?.Update(entity);

            var updatedEntity = _orderStatusRepository?.GetById(id);

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
        public void GetPaymentById_Return_Correct_Entity(int id)
        {
            var result = _paymentRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Payment_Entity(int id)
        {
            var result = _paymentRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _paymentRepository?.Delete(result);
            var count = _paymentRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Payment_Entity()
        {
            var entity = new Payment()
            {
                Id = 3,
                PaymentMethod = "Credit Card",
                Status = "Status",
                Amount = 10
            };

            _paymentRepository?.Add(entity);

            var list = _paymentRepository?.GetAll().ToList();
            var entityThatWasAdded = _paymentRepository?.GetById(3);

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
        public void Update_Payment_Entity(int id)
        {
            var entity = _paymentRepository?.GetById(id);

            entity.PaymentMethod = "PayPal";

            _paymentRepository?.Update(entity);

            var updatedEntity = _paymentRepository?.GetById(id);

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
        public void GetProductById_Return_Correct_Entity(int id)
        {
            var result = _productRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Product_Entity(int id)
        {
            var result = _productRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _productRepository?.Delete(result);
            var count = _productRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Product_Entity()
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

            _productRepository?.Add(entity);

            var list = _productRepository?.GetAll().ToList();
            var entityThatWasAdded = _productRepository?.GetById(3);

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
        public void Update_Product_Entity(int id)
        {
            var entity = _productRepository?.GetById(id);

            entity.Price = 199.99m;

            _productRepository?.Update(entity);

            var updatedEntity = _productRepository?.GetById(id);

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
        public void GetProductImageById_Return_Correct_Entity(int id)
        {
            var result = _productImageRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_ProductImage_Entity(int id)
        {
            var result = _productImageRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _productImageRepository?.Delete(result);
            var count = _productImageRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_ProductImage_Entity()
        {
            var entity = new ProductImage()
            {
                Id = 3,
                FkProducts = 1,
                ImageData = Encoding.ASCII.GetBytes("https://example.com/image1.jpg")
            };

            _productImageRepository?.Add(entity);

            var list = _productImageRepository?.GetAll().ToList();
            var entityThatWasAdded = _productImageRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_ProductImage_Entity(int id)
        {
            var entity = _productImageRepository?.GetById(id);

            entity.ImageData = System.Text.Encoding.UTF8.GetBytes("http://example.com/updated-image.jpg");

            _productImageRepository?.Update(entity);

            var updatedEntity = _productImageRepository?.GetById(id);

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
        public void GetProductTranslationById_Return_Correct_Entity(int id)
        {
            var result = _productTranslationRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_ProductTranslation_Entity(int id)
        {
            var result = _productTranslationRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _productTranslationRepository?.Delete(result);
            var count = _productTranslationRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_ProductTranslation_Entity()
        {
            var entity = new ProductTranslation()
            {
                Id = 3,
                FkProducts = 1,
                FkLanguages = 1,
                Name = "New Product",
                Description = "Description of new product"
            };

            _productTranslationRepository?.Add(entity);

            var list = _productTranslationRepository?.GetAll().ToList();
            var entityThatWasAdded = _productTranslationRepository?.GetById(3);

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
        public void Update_ProductTranslation_Entity(int id)
        {
            var entity = _productTranslationRepository?.GetById(id);

            entity.Name = "Updated Title";

            _productTranslationRepository?.Update(entity);

            var updatedEntity = _productTranslationRepository?.GetById(id);

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
        public void GetReviewById_Return_Correct_Entity(int id)
        {
            var result = _reviewRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Review_Entity(int id)
        {
            var result = _reviewRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _reviewRepository?.Delete(result);
            var count = _reviewRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
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
                Comment = "Excellent product!"
            };

            _reviewRepository?.Add(entity);

            var list = _reviewRepository?.GetAll().ToList();
            var entityThatWasAdded = _reviewRepository?.GetById(3);

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
        public void Update_Review_Entity(int id)
        {
            var entity = _reviewRepository?.GetById(id);

            entity.Rating = 4;

            _reviewRepository?.Update(entity);

            var updatedEntity = _reviewRepository?.GetById(id);

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
        public void GetUserById_Return_Correct_Entity(int id)
        {
            var result = _userRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_User_Entity(int id)
        {
            var result = _userRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _userRepository?.Delete(result);
            var count = _userRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_User_Entity()
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

            _userRepository?.Add(entity);

            var list = _userRepository?.GetAll().ToList();
            var entityThatWasAdded = _userRepository?.GetById(3);

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
        public void Update_User_Entity(int id)
        {
            var entity = _userRepository?.GetById(id);

            entity.Email = "updated_email@example.com";

            _userRepository?.Update(entity);

            var updatedEntity = _userRepository?.GetById(id);

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
        public void GetUserProfileById_Return_Correct_Entity(int id)
        {
            var result = _userProfileRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_UserProfile_Entity(int id)
        {
            var result = _userProfileRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _userProfileRepository?.Delete(result);
            var count = _userProfileRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_UserProfile_Entity()
        {
            var entity = new UserProfile()
            {
                Id = 3,
                FkUsers = 1,
                FirstName = "John",
                LastName = "Doe",
                Phone = "123456789"
            };

            _userProfileRepository?.Add(entity);

            var list = _userProfileRepository?.GetAll().ToList();
            var entityThatWasAdded = _userProfileRepository?.GetById(3);

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
        public void Update_UserProfile_Entity(int id)
        {
            var entity = _userProfileRepository?.GetById(id);

            entity.LastName = "UpdatedLastName";

            _userProfileRepository?.Update(entity);

            var updatedEntity = _userProfileRepository?.GetById(id);

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
        public void GetUserRoleById_Return_Correct_Entity(int id)
        {
            var result = _userRoleRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_UserRole_Entity(int id)
        {
            var result = _userRoleRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _userRoleRepository?.Delete(result);
            var count = _userRoleRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_UserRole_Entity()
        {
            var entity = new UserRole()
            {
                Id = 3,
                Name = "NewRole"
            };

            _userRoleRepository?.Add(entity);

            var list = _userRoleRepository?.GetAll().ToList();
            var entityThatWasAdded = _userRoleRepository?.GetById(3);

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
        public void Update_UserRole_Entity(int id)
        {
            var entity = _userRoleRepository?.GetById(id);

            entity.Name = "UpdatedRoleName";

            _userRoleRepository?.Update(entity);

            var updatedEntity = _userRoleRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(updatedEntity?.Name, Is.EqualTo(entity?.Name));
            });
        }

        #endregion
    }
}
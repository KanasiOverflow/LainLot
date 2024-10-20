using Moq;
using Moq.EntityFrameworkCore;
using DatabaseProvider.Models;
using NUnitTests.Classes;

namespace NUnitTests.DatabaseProvider
{
    public class LainLotContextTests
    {
        private Mock<LainLotContext> _context;

        [SetUp]
        public void Setup()
        {
            _context = new Mock<LainLotContext>();

            _context.Setup(x => x.Abouts).ReturnsDbSet(DatabaseDataFake.GetFakeAboutList());
            _context.Setup(x => x.AccessLevels).ReturnsDbSet(DatabaseDataFake.GetFakeAccessLevelList());
            _context.Setup(x => x.Carts).ReturnsDbSet(DatabaseDataFake.GetFakeCartsList());
            _context.Setup(x => x.Categories).ReturnsDbSet(DatabaseDataFake.GetFakeCategoryList());
            _context.Setup(x => x.CategoryHierarchies).ReturnsDbSet(DatabaseDataFake.GetFakeCategoryHierarchyList());
            _context.Setup(x => x.Colors).ReturnsDbSet(DatabaseDataFake.GetFakeColorList());
            _context.Setup(x => x.Contacts).ReturnsDbSet(DatabaseDataFake.GetFakeContactList());
            _context.Setup(x => x.CustomizableProducts).ReturnsDbSet(DatabaseDataFake.GetFakeCustomizableProductList());
            _context.Setup(x => x.CustomizationOrders).ReturnsDbSet(DatabaseDataFake.GetFakeCustomizationOrderList());
            _context.Setup(x => x.FabricTypes).ReturnsDbSet(DatabaseDataFake.GetFakeFabricTypeList());
            _context.Setup(x => x.Languages).ReturnsDbSet(DatabaseDataFake.GetFakeLanguageList());
            _context.Setup(x => x.Orders).ReturnsDbSet(DatabaseDataFake.GetFakeOrderList());
            _context.Setup(x => x.OrderHistories).ReturnsDbSet(DatabaseDataFake.GetFakeOrderHistoryList());
            _context.Setup(x => x.OrderStatuses).ReturnsDbSet(DatabaseDataFake.GetFakeOrderStatusList());
            _context.Setup(x => x.Payments).ReturnsDbSet(DatabaseDataFake.GetFakePaymentList());
            _context.Setup(x => x.Products).ReturnsDbSet(DatabaseDataFake.GetFakeProductList());
            _context.Setup(x => x.ProductImages).ReturnsDbSet(DatabaseDataFake.GetFakeProductImageList());
            _context.Setup(x => x.ProductTranslations).ReturnsDbSet(DatabaseDataFake.GetFakeProductTranslationList());
            _context.Setup(x => x.Reviews).ReturnsDbSet(DatabaseDataFake.GetFakeReviewList());
            _context.Setup(x => x.Users).ReturnsDbSet(DatabaseDataFake.GetFakeUserList());
            _context.Setup(x => x.UserProfiles).ReturnsDbSet(DatabaseDataFake.GetFakeUserProfileList());
            _context.Setup(x => x.UserRoles).ReturnsDbSet(DatabaseDataFake.GetFakeUserRoleList());
        }

        [Test]
        public void Get_About_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Abouts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_AccessLevel_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.AccessLevels.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Cart_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Carts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Category_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Categories.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_CategoryHierarchy_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.CategoryHierarchy.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Color_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Colors.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Contact_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Contacts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_CustomizableProduct_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.CustomizableProducts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_CustomizationOrder_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.CustomizationOrders.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_FabricType_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.FabricTypes.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Language_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Languages.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Order_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Orders.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_OrderHistory_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.OrderHistory.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_OrderStatus_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.OrderStatuses.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Payment_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Payments.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Product_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Products.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_ProductImage_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.ProductImages.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_ProductTranslation_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.ProductTranslations.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_Review_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Reviews.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_User_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Users.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_UserProfile_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.UserProfiles.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }

        [Test]
        public void Get_UserRole_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.UserRoles.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2)); // Замените 2 на актуальное значение
        }
    }
}

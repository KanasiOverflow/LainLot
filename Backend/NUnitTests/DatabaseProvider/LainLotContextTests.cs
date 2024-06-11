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
            _context.Setup(x => x.Contacts).ReturnsDbSet(DatabaseDataFake.GetFakeContactList());
            _context.Setup(x => x.Languages).ReturnsDbSet(DatabaseDataFake.GetFakeLanguageList());
            _context.Setup(x => x.Posts).ReturnsDbSet(DatabaseDataFake.GetFakePostList());
            _context.Setup(x => x.PostsTranslations).ReturnsDbSet(DatabaseDataFake.GetFakePostsTranslationList());
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
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_AccessLevel_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.AccessLevels.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_Contact_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Contacts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_Language_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Languages.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }


        [Test]
        public void Get_Post_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Posts.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_PostsTranslation_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.PostsTranslations.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_User_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.Users.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_UserProfile_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.UserProfiles.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void Get_UserRole_List()
        {
            var fakeContext = new LainLotContextFake(_context.Object);
            var result = fakeContext.UserRoles.ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
        }
    }
}
using NUnitTests.Classes;
using Microsoft.EntityFrameworkCore;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using DatabaseRepository.Classes;

namespace NUnitTests.DatabaseRepository
{
    public class InitDBWithFake100Records
    {
        private DbContextFake? _context;
        private IRepository<About>? _aboutRepository;
        private IRepository<AccessLevel>? _accessLevelRepository;
        private IRepository<Contact>? _contactRepository;
        private IRepository<Language>? _languageRepository;
        private IRepository<Post>? _postRepository;
        private IRepository<PostsTranslation>? _postsTranslationRepository;
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

            // Create a fake data
            var abouts = DatabaseDataFake.GetFakeAboutList100();
            var accessLevels = DatabaseDataFake.GetFakeAccessLevelList100();
            var contacts = DatabaseDataFake.GetFakeContactList100();
            var languages = DatabaseDataFake.GetFakeLanguageList100();
            var posts = DatabaseDataFake.GetFakePostList100();
            var postTranslations = DatabaseDataFake.GetFakePostsTranslationList100();
            var users = DatabaseDataFake.GetFakeUserList100();
            var userProfiles = DatabaseDataFake.GetFakeUserProfileList100();
            var userRoles = DatabaseDataFake.GetFakeUserRoleList100();

            // Init base data in fake DbContext
            _context.Abouts.AddRange(abouts);
            _context.AccessLevels.AddRange(accessLevels);
            _context.Contacts.AddRange(contacts);
            _context.Languages.AddRange(languages);
            _context.Posts.AddRange(posts);
            _context.PostsTranslations.AddRange(postTranslations);
            _context.Users.AddRange(users);
            _context.UserProfiles.AddRange(userProfiles);
            _context.UserRoles.AddRange(userRoles);

            // Save data in fake DbContext
            _context.SaveChanges();

            _aboutRepository = new Repository<About>(_context);
            _accessLevelRepository = new Repository<AccessLevel>(_context);
            _contactRepository = new Repository<Contact>(_context);
            _languageRepository = new Repository<Language>(_context);
            _postRepository = new Repository<Post>(_context);
            _postsTranslationRepository = new Repository<PostsTranslation>(_context);
            _userRepository = new Repository<User>(_context);
            _userProfileRepository = new Repository<UserProfile>(_context);
            _userRoleRepository = new Repository<UserRole>(_context);
        }

        [TearDown]
        public void FinishTest()
        {
            _context?.Dispose();
        }

        [Test]
        public void GetAbout_Return_100_Items()
        {
            var result = _aboutRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetAccessLevel_Return_100_Items()
        {
            var result = _accessLevelRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetContact_Return_100_Items()
        {
            var result = _contactRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }


        [Test]
        public void GetLanguage_Return_100_Items()
        {
            var result = _languageRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetPost_Return_100_Items()
        {
            var result = _postRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetPostTranslation_Return_100_Items()
        {
            var result = _postsTranslationRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetUser_Return_100_Items()
        {
            var result = _userRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetUserProfile_Return_100_Items()
        {
            var result = _userProfileRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }

        [Test]
        public void GetUserRole_Return_100_Items()
        {
            var result = _userRoleRepository?.GetAll().ToList();

            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(100));
        }
    }
}
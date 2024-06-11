using NUnitTests.Classes;
using Microsoft.EntityFrameworkCore;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using DatabaseRepository.Classes;

namespace NUnitTests.DatabaseRepository
{
    public class RepositoryTests
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
            var abouts = DatabaseDataFake.GetFakeAboutList();
            var accessLevels = DatabaseDataFake.GetFakeAccessLevelList();
            var contacts = DatabaseDataFake.GetFakeContactList();
            var languages = DatabaseDataFake.GetFakeLanguageList();
            var posts = DatabaseDataFake.GetFakePostList();
            var postTranslations = DatabaseDataFake.GetFakePostsTranslationList();
            var users = DatabaseDataFake.GetFakeUserList();
            var userProfiles = DatabaseDataFake.GetFakeUserProfileList();
            var userRoles = DatabaseDataFake.GetFakeUserRoleList();

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

            entity.Text = "Text 3";

            _aboutRepository?.Update(entity);

            var updateEntity = _aboutRepository?.GetById(id);

            Assert.That(updateEntity?.Text, Is.EqualTo(entity?.Text));
        }

        #endregion

        #region AccessLevels table

        [Test]
        public void GetAccessLevel_Return_2_Items()
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
                Description = "Description 3",
                Level = 3
            };

            _accessLevelRepository?.Add(entity);

            var list = _accessLevelRepository?.GetAll().ToList();
            var entityThatWasAdded = _accessLevelRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.Level, Is.EqualTo(entity?.Level));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_AccessLevel_Entity(int id)
        {
            var entity = _accessLevelRepository?.GetById(id);

            entity.Description = "Text 3";

            _accessLevelRepository?.Update(entity);

            var updateEntity = _accessLevelRepository?.GetById(id);

            Assert.That(updateEntity?.Description, Is.EqualTo(entity?.Description));
        }

        #endregion

        #region Contacts table

        [Test]
        public void GetContact_Return_2_Items()
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
                Address = "Address 3",
                Email = "Email 3",
                FkLanguages = 1,
                Phone = "000-000-000"
            };

            _contactRepository?.Add(entity);

            var list = _contactRepository?.GetAll().ToList();
            var entityThatWasAdded = _contactRepository?.GetById(3);

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
        public void Update_Contact_Entity(int id)
        {
            var entity = _contactRepository?.GetById(id);

            entity.Email = "Text 3";

            _contactRepository?.Update(entity);

            var updateEntity = _contactRepository?.GetById(id);

            Assert.That(updateEntity?.Email, Is.EqualTo(entity?.Email));
        }

        #endregion

        #region Languages table

        [Test]
        public void GetLanguage_Return_2_Items()
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
                Abbreviation = "PL-PL",
                DateFormat = "DDMMYYYY",
                Description = "Language 3",
                FullName = "Language 3",
                TimeFormat = "HH:MM:SS"
            };

            _languageRepository?.Add(entity);

            var list = _languageRepository?.GetAll().ToList();
            var entityThatWasAdded = _languageRepository?.GetById(3);

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
        public void Update_Language_Entity(int id)
        {
            var entity = _languageRepository?.GetById(id);

            entity.FullName = "Text 3";

            _languageRepository?.Update(entity);

            var updateEntity = _languageRepository?.GetById(id);

            Assert.That(updateEntity?.FullName, Is.EqualTo(entity?.FullName));
        }

        #endregion

        #region Posts table

        [Test]
        public void GetPost_Return_2_Items()
        {
            var result = _postRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetPostById_Return_Correct_Entity(int id)
        {
            var result = _postRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_Post_Entity(int id)
        {
            var result = _postRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _postRepository?.Delete(result);
            var count = _postRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_Post_Entity()
        {
            var entity = new Post()
            {
                Id = 3,
                PostDate = DateOnly.Parse("07/02/2024"),
                PostTime = TimeOnly.Parse("12:00:00"),
                Name = "Name 3",
                Description = "Description 3",
                Text = "Text 3",
                Tags = "#Tag3",
                Photo = "Photo 3",
                VisitCount = 3
            };

            _postRepository?.Add(entity);

            var list = _postRepository?.GetAll().ToList();
            var entityThatWasAdded = _postRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.VisitCount, Is.EqualTo(entity?.VisitCount));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_Post_Entity(int id)
        {
            var entity = _postRepository?.GetById(id);

            entity.Text = "Text 3";

            _postRepository?.Update(entity);

            var updateEntity = _postRepository?.GetById(id);

            Assert.That(updateEntity?.Text, Is.EqualTo(entity?.Text));
        }

        #endregion

        #region PostTranslations table

        [Test]
        public void GetPostTranslation_Return_2_Items()
        {
            var result = _postsTranslationRepository?.GetAll().ToList();

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result, Has.Count.EqualTo(2));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void GetPostTranslationById_Return_Correct_Entity(int id)
        {
            var result = _postsTranslationRepository?.GetById(id);

            Assert.Multiple(() =>
            {
                Assert.That(result, Is.Not.Null);
                Assert.That(result?.Id, Is.EqualTo(id));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Delete_PostTranslation_Entity(int id)
        {
            var result = _postsTranslationRepository?.GetById(id);

            Assert.That(result, Is.Not.Null);

            _postsTranslationRepository?.Delete(result);
            var count = _postsTranslationRepository?.GetAll().Count();

            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public void Add_PostTranslation_Entity()
        {
            var entity = new PostsTranslation()
            {
                Id = 3,
                FkLanguages = 1,
                FkPosts = 1,
                Name = "Name 3",
                Description = "Description 3",
                Text = "Text 3"
            };

            _postsTranslationRepository?.Add(entity);

            var list = _postsTranslationRepository?.GetAll().ToList();
            var entityThatWasAdded = _postsTranslationRepository?.GetById(3);

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
        public void Update_PostTranslation_Entity(int id)
        {
            var entity = _postsTranslationRepository?.GetById(id);

            entity.Text = "Text 3";

            _postsTranslationRepository?.Update(entity);

            var updateEntity = _postsTranslationRepository?.GetById(id);

            Assert.That(updateEntity?.Text, Is.EqualTo(entity?.Text));
        }

        #endregion

        #region Users table

        [Test]
        public void GetUser_Return_2_Items()
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
                FkUserRoles = 1,
                Login = "Login 3",
                Email = "Email 3",
                Password = "Password 3",
                DateLink = "DateLink 3",
                TimeLink = "TimeLink 3",
                ConfirmEmail = 0,
                Hash = "Hash 3"
            };

            _userRepository?.Add(entity);

            var list = _userRepository?.GetAll().ToList();
            var entityThatWasAdded = _userRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkUserRoles, Is.EqualTo(entity?.FkUserRoles));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_User_Entity(int id)
        {
            var entity = _userRepository?.GetById(id);

            entity.Email = "Text 3";

            _userRepository?.Update(entity);

            var updateEntity = _userRepository?.GetById(id);

            Assert.That(updateEntity?.Email, Is.EqualTo(entity?.Email));
        }

        #endregion

        #region UserProfiles table

        [Test]
        public void GetUserProfile_Return_2_Items()
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
                CreateDate = "CreateDate 3",
                CreateTime = "CreateTime 3",
                FirstName = "FirstName 3",
                LastName = "LastName 3",
                MiddleName = "MiddleName 3",
                Address = "Address 3",
                City = "City 3",
                ZipPostCode = 00000,
                StateProvince = "StateProvince 3",
                Country = "Country 3",
                Phone = "Phone 3",
                Avatar = "Avatar 3"
            };

            _userProfileRepository?.Add(entity);

            var list = _userProfileRepository?.GetAll().ToList();
            var entityThatWasAdded = _userProfileRepository?.GetById(3);

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
        public void Update_UserProfile_Entity(int id)
        {
            var entity = _userProfileRepository?.GetById(id);

            entity.LastName = "Text 3";

            _userProfileRepository?.Update(entity);

            var updateEntity = _userProfileRepository?.GetById(id);

            Assert.That(updateEntity?.LastName, Is.EqualTo(entity?.LastName));
        }

        #endregion

        #region UserRoles table

        [Test]
        public void GetUserRole_Return_2_Items()
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
                FkAccessLevels = 1,
                Name = "Name 3"
            };

            _userRoleRepository?.Add(entity);

            var list = _userRoleRepository?.GetAll().ToList();
            var entityThatWasAdded = _userRoleRepository?.GetById(3);

            Assert.Multiple(() =>
            {
                Assert.That(list, Has.Count.EqualTo(3));
                Assert.That(entityThatWasAdded, Is.Not.Null);
                Assert.That(entityThatWasAdded?.FkAccessLevels, Is.EqualTo(entity?.FkAccessLevels));
            });
        }

        [Test]
        [TestCase(1)]
        [TestCase(2)]
        public void Update_UserRole_Entity(int id)
        {
            var entity = _userRoleRepository?.GetById(id);

            entity.Name = "Text 3";

            _userRoleRepository?.Update(entity);

            var updateEntity = _userRoleRepository?.GetById(id);

            Assert.That(updateEntity?.Name, Is.EqualTo(entity?.Name));
        }

        #endregion
    }
}
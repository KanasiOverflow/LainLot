using DatabaseProvider.Models;

namespace NUnitTests.Classes
{
    public static class DatabaseDataFake
    {
        public static List<About> GetFakeAboutList()
        {
            return
            [
                new About()
                {
                    Id = 1,
                    FkLanguages = 1,
                    Header = "Header 1",
                    Text = "Text 1"
                },
                new About()
                {
                    Id = 2,
                    FkLanguages = 1,
                    Header = "Header 2",
                    Text = "Text 2"
                }
            ];
        }

        public static List<About> GetFakeAboutList100()
        {
            var list = new List<About>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new About()
                {
                    Id = 100 + i,
                    FkLanguages = 100 + i,
                    Header = "Header " + i,
                    Text = "Text " + i
                });
            }

            return list;
        }

        public static List<AccessLevel> GetFakeAccessLevelList()
        {
            return
            [
                new AccessLevel()
                {
                    Id = 1,
                    Description = "Description 1",
                    Level = 1
                },
                new AccessLevel()
                {
                    Id = 2,
                    Description = "Description 2",
                    Level = 1
                }
            ];
        }

        public static List<AccessLevel> GetFakeAccessLevelList100()
        {
            var list = new List<AccessLevel>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new AccessLevel()
                {
                    Id = 100 + i,
                    Description = "Description " + i,
                    Level = 100 + i
                });
            }

            return list;
        }

        public static List<Contact> GetFakeContactList()
        {
            return
            [
                new Contact()
                {
                    Id = 1,
                    Address = "Address 1",
                    Email = "Email 1",
                    FkLanguages = 1,
                    Phone = "000-000-000"
                },
                new Contact()
                {
                    Id = 2,
                    Address = "Address 2",
                    Email = "Email 2",
                    FkLanguages = 1,
                    Phone = "000-000-000"
                }
            ];
        }

        public static List<Contact> GetFakeContactList100()
        {
            var list = new List<Contact>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new Contact()
                {
                    Id = 100 + i,
                    Address = "Address " + i,
                    Email = "Email " + i,
                    FkLanguages = 100 + i,
                    Phone = Guid.NewGuid().ToString()
                });
            }

            return list;
        }

        public static List<Language> GetFakeLanguageList()
        {
            return
            [
                new Language()
                {
                    Id = 1,
                    Abbreviation = "en-US",
                    DateFormat = "DDMMYYYY",
                    Description = "Language 1",
                    FullName = "Language 1",
                    TimeFormat = "HH:MM:SS"
                },
                new Language()
                {
                    Id = 2,
                    Abbreviation = "Ru-RU",
                    DateFormat = "DDMMYYYY",
                    Description = "Language 2",
                    FullName = "Language 2",
                    TimeFormat = "HH:MM:SS"
                }
            ];
        }

        public static List<Language> GetFakeLanguageList100()
        {
            var list = new List<Language>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new Language()
                {
                    Id = 100 + i,
                    Abbreviation = Guid.NewGuid().ToString(),
                    DateFormat = Guid.NewGuid().ToString(),
                    Description = "Language " + i,
                    FullName = "Language " + i,
                    TimeFormat = Guid.NewGuid().ToString()
                });
            }

            return list;
        }

        public static List<Post> GetFakePostList()
        {
            return
            [
                new Post()
                {
                    Id = 1,
                    PostDate = DateOnly.Parse("07/02/2024"),
                    PostTime = TimeOnly.Parse("12:00:00"),
                    Name = "Name 1",
                    Description = "Description 1",
                    Text = "Text 1",
                    Tags = "#Tag1",
                    Photo = "Photo 1",
                    VisitCount = 1
                },
                new Post()
                {
                    Id = 2,
                    PostDate = DateOnly.Parse("07/02/2024"),
                    PostTime = TimeOnly.Parse("14:00:00"),
                    Name = "Name 2",
                    Description = "Description 2",
                    Text = "Text 2",
                    Tags = "#Tag2",
                    Photo = "Photo 2",
                    VisitCount = 1
                }
            ];
        }

        public static List<Post> GetFakePostList100()
        {
            var list = new List<Post>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new Post()
                {
                    Id = 100 + i,
                    PostDate = DateOnly.Parse(DateTime.Now.ToShortDateString()),
                    PostTime = TimeOnly.Parse("00:00:00"),
                    Name = "Name " + i,
                    Description = Guid.NewGuid().ToString(),
                    Text = Guid.NewGuid().ToString(),
                    Tags = Guid.NewGuid().ToString(),
                    Photo = Guid.NewGuid().ToString(),
                    VisitCount = 1
                });
            }

            return list;
        }

        public static List<PostsTranslation> GetFakePostsTranslationList()
        {
            return
            [
                new PostsTranslation()
                {
                    Id = 1,
                    FkLanguages = 1,
                    FkPosts = 1,
                    Name = "Name 1",
                    Description = "Description 1",
                    Text = "Text 1"
                },
                new PostsTranslation()
                {
                    Id = 2,
                    FkLanguages = 1,
                    FkPosts = 1,
                    Name = "Name 2",
                    Description = "Description 2",
                    Text = "Text 2"
                }
            ];
        }

        public static List<PostsTranslation> GetFakePostsTranslationList100()
        {
            var list = new List<PostsTranslation>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new PostsTranslation()
                {
                    Id = 100 + i,
                    FkLanguages = 100 + i,
                    FkPosts = 100 + i,
                    Name = "Name " + i,
                    Description = Guid.NewGuid().ToString(),
                    Text = Guid.NewGuid().ToString()
                });
            }

            return list;
        }

        public static List<User> GetFakeUserList()
        {
            return
            [
                new User()
                {
                    Id = 1,
                    FkUserRoles = 1,
                    Login = "Login 1",
                    Email = "Email 1",
                    Password = "Password 1",
                    DateLink = "DateLink 1",
                    TimeLink = "TimeLink 1",
                    ConfirmEmail = 0,
                    Hash = "Hash 1"
                },
                new User()
                {
                    Id = 2,
                    FkUserRoles = 1,
                    Login = "Login 2",
                    Email = "Email 2",
                    Password = "Password 2",
                    DateLink = "DateLink 2",
                    TimeLink = "TimeLink 2",
                    ConfirmEmail = 0,
                    Hash = "Hash 2"
                }
            ];
        }

        public static List<User> GetFakeUserList100()
        {
            var list = new List<User>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new User()
                {
                    Id = 100 + i,
                    FkUserRoles = 100 + i,
                    Login = "Login " + i,
                    Email = "Email " + i,
                    Password = Guid.NewGuid().ToString(),
                    DateLink = Guid.NewGuid().ToString(),
                    TimeLink = Guid.NewGuid().ToString(),
                    ConfirmEmail = 0,
                    Hash = Guid.NewGuid().ToString()
                });
            }

            return list;
        }

        public static List<UserProfile> GetFakeUserProfileList()
        {
            return
            [
                new UserProfile()
                {
                    Id = 1,
                    FkUsers = 1,
                    CreateDate = "CreateDate 1",
                    CreateTime = "CreateTime 1",
                    FirstName = "FirstName 1",
                    LastName = "LastName 1",
                    MiddleName = "MiddleName 1",
                    Address = "Address 1",
                    City = "City 1",
                    ZipPostCode = 00000,
                    StateProvince = "StateProvince 1",
                    Country = "Country 1",
                    Phone = "Phone 1",
                    Avatar = "Avatar 1"
                },
                new UserProfile()
                {
                    Id = 2,
                    FkUsers = 1,
                    CreateDate = "CreateDate 2",
                    CreateTime = "CreateTime 2",
                    FirstName = "FirstName 2",
                    LastName = "LastName 2",
                    MiddleName = "MiddleName 2",
                    Address = "Address 2",
                    City = "City 2",
                    ZipPostCode = 00000,
                    StateProvince = "StateProvince 2",
                    Country = "Country 2",
                    Phone = "Phone 2",
                    Avatar = "Avatar 2"
                }
            ];
        }

        public static List<UserProfile> GetFakeUserProfileList100()
        {
            var list = new List<UserProfile>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new UserProfile()
                {
                    Id = 100 + i,
                    FkUsers = 100 + i,
                    CreateDate = Guid.NewGuid().ToString(),
                    CreateTime = Guid.NewGuid().ToString(),
                    FirstName = Guid.NewGuid().ToString(),
                    LastName = Guid.NewGuid().ToString(),
                    MiddleName = Guid.NewGuid().ToString(),
                    Address = Guid.NewGuid().ToString(),
                    City = Guid.NewGuid().ToString(),
                    ZipPostCode = 00000,
                    StateProvince = Guid.NewGuid().ToString(),
                    Country = Guid.NewGuid().ToString(),
                    Phone = Guid.NewGuid().ToString(),
                    Avatar = Guid.NewGuid().ToString(),
                });
            }

            return list;
        }

        public static List<UserRole> GetFakeUserRoleList()
        {
            return
            [
                new UserRole()
                {
                    Id = 1,
                    FkAccessLevels = 1,
                    Name = "Name 1"
                },
                new UserRole()
                {
                    Id = 2,
                    FkAccessLevels = 1,
                    Name = "Name 2"
                }
            ];
        }

        public static List<UserRole> GetFakeUserRoleList100()
        {
            var list = new List<UserRole>();

            for (int i = 0; i < 100; i++)
            {
                list.Add(new UserRole()
                {
                    Id = 100 + i,
                    FkAccessLevels = 100 + i,
                    Name = Guid.NewGuid().ToString()
                });
            }

            return list;
        }
    }
}
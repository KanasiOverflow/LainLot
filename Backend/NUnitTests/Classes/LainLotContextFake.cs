using DatabaseProvider.Models;
using Microsoft.EntityFrameworkCore;

namespace NUnitTests.Classes
{
    public class LainLotContextFake(LainLotContext dbContext)
    {
        private readonly LainLotContext _dbContext = dbContext;

        public DbSet<About> Abouts => _dbContext.Abouts;

        public DbSet<AccessLevel> AccessLevels => _dbContext.AccessLevels;

        public DbSet<Contact> Contacts => _dbContext.Contacts;

        public DbSet<Language> Languages => _dbContext.Languages;

        public DbSet<Post> Posts => _dbContext.Posts;

        public DbSet<PostsTranslation> PostsTranslations => _dbContext.PostsTranslations;

        public DbSet<User> Users => _dbContext.Users;

        public DbSet<UserProfile> UserProfiles => _dbContext.UserProfiles;

        public DbSet<UserRole> UserRoles => _dbContext.UserRoles;
    }
}
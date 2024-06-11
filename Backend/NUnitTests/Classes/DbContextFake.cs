using Microsoft.EntityFrameworkCore;
using DatabaseProvider.Models;

namespace NUnitTests.Classes
{
    public class DbContextFake : DbContext, IDisposable
    {
        public DbContextFake(DbContextOptions<DbContextFake> options)
        : base(options)
        {
        }

        public virtual DbSet<About> Abouts { get; set; }

        public virtual DbSet<AccessLevel> AccessLevels { get; set; }

        public virtual DbSet<Contact> Contacts { get; set; }

        public virtual DbSet<Language> Languages { get; set; }

        public virtual DbSet<Post> Posts { get; set; }

        public virtual DbSet<PostsTranslation> PostsTranslations { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<UserProfile> UserProfiles { get; set; }

        public virtual DbSet<UserRole> UserRoles { get; set; }

        public override void Dispose()
        {
            base.Dispose();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using NomNom.Core;
using NomNom.Core.Models;
using NomNom.Infrastructure.Configurations;
namespace NomNom.Infrastructure.Data
{
    public class NomNomContext : DbContext
    {
        public NomNomContext(DbContextOptions<NomNomContext> options)
            : base(options)
        {
        }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<RecipeModel> Recipes { get; set; }
        public DbSet<ImagesModel> Images { get; set; }
        public DbSet<RecipeBookModel> RecipeBook { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new RecipeConfiguration());
            modelBuilder.ApplyConfiguration(new ImagesConfiguration());
            modelBuilder.ApplyConfiguration(new RecipeBookConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}

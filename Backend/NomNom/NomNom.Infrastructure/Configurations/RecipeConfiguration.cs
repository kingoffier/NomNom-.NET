using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NomNom.Core.Models;

namespace NomNom.Infrastructure.Configurations
{
    public class RecipeConfiguration : IEntityTypeConfiguration<RecipeModel>
    {
        public void Configure(EntityTypeBuilder<RecipeModel> builder)
        {
            builder.ToTable("Recipe");
            builder.HasKey(x => x.Id);
            builder.Property(e => e.Name)
                .HasMaxLength(50);
            builder.Property(e => e.Time)
                .HasMaxLength(10);
            builder.Property(e => e.Kitchen)
                .HasMaxLength(100);
            builder.Property(e => e.Category)
                .HasMaxLength(25);
            builder.HasMany(e => e.Images).WithOne(e => e.Recipe)
            .HasForeignKey(d => d.IdRecipe)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_Images_Recipe");
            builder.HasMany(e => e.RecipeBooks).WithOne(e => e.Recipe)
            .HasForeignKey(d => d.IdRecipe)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_RecipeBook_Recipe");
        }
    }
}

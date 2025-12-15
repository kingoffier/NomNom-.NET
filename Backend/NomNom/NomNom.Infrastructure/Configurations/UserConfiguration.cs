using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NomNom.Core;

namespace NomNom.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserModel>
    {
        public void Configure(EntityTypeBuilder<UserModel> builder)
        {
            builder.ToTable("User");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            builder.Property(e => e.FirstName)
                .HasMaxLength(50);
            builder.Property(e => e.Login)
                .HasMaxLength(50)
                .IsUnicode(false);
            builder.Property(e => e.SecondName)
                .HasMaxLength(50);
            builder.Property(e => e.AvatarURL)
                .IsUnicode(false);
            builder.Property(e => e.Role).HasDefaultValue(1);
            builder.HasMany(e=>e.Recipes).WithOne(e=>e.User)
                .HasForeignKey(d => d.IdUser)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Recipe_User");
            builder.HasMany(e => e.RecipeBooks).WithOne(e => e.User)
            .HasForeignKey(d => d.IdUser)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_RecipeBook_User");
        }
    }
}

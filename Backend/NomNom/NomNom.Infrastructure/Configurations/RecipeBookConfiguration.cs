using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Configurations
{
    public class RecipeBookConfiguration : IEntityTypeConfiguration<RecipeBookModel>
    {
        public void Configure(EntityTypeBuilder<RecipeBookModel> builder)
        {
            builder.ToTable("RecipeBook");
            builder.HasKey(x => x.Id);
        }
    }
}

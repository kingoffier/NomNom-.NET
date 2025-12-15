using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Models;
using NomNom.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Repositories
{
    public class ImagesRepository : IImagesRepository
    {
        private readonly NomNomContext _context;
        public ImagesRepository(NomNomContext context)
        {
            _context = context;
        }
        public async Task CreateTaskImage(ImagesModel image)
        {
            await _context.Images.AddAsync(image);
            await _context.SaveChangesAsync();
        }

        public Task DeleteAsync(List<ImagesModel> image)
        {
            for (int i = 0; i < image.Count(); i++)
            {
                var result = _context.Images.Remove(image[i]);
            }
            return _context.SaveChangesAsync();
        }

        public async Task<List<ImagesModel>> GetAllByIdRecipe(int idRecipe)
        {
            var result = _context.Images.Where(x => x.IdRecipe == idRecipe);
            return await result.ToListAsync();
        }

    }
}

using Microsoft.EntityFrameworkCore;
using NomNom.Core;
using NomNom.Core.Interfaces.RecipeBook;
using NomNom.Core.Models;
using NomNom.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Repositories
{
    public class RecipeBookRepository:IRecipeBookRepository
    {
        private readonly NomNomContext _context;
        public RecipeBookRepository(NomNomContext context)
        {
            _context = context;
        }

        public async Task AddToBookAsync(RecipeBookModel recipe)
        {
            await _context.AddAsync(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RecipeBookModel>> GetAllAsync()
        {
            return await _context.RecipeBook.ToListAsync();
        }

        public async Task<List<RecipeBookModel>> GetAllBookByIdUser(int id)
        {
            return await _context.RecipeBook.Where(x=>x.IdUser == id).ToListAsync();
        }

        public async Task<RecipeBookModel?> GetByIdAsync(int id)
        {
            return await _context.RecipeBook.FirstOrDefaultAsync(x => x.IdUser == id);
        }

        public async Task<RecipeBookModel?> GetByIdUserAsync(int idRecipe, int idUser)
        {
            return await _context.RecipeBook.FirstOrDefaultAsync(x => x.IdRecipe == idRecipe && x.IdUser==idUser);
        }

        public async Task RemoveToBookAsync(RecipeBookModel recipe)
        {
            _context.RecipeBook.Remove(recipe);
            await _context.SaveChangesAsync();
        }

        public Task RemoveToBookAsync(int recipe)
        {
            throw new NotImplementedException();
        }
    }
}

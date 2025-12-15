using Microsoft.EntityFrameworkCore;
using NomNom.Core.Interfaces.Recipe;
using NomNom.Core.Models;
using NomNom.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly NomNomContext _context;
        public RecipeRepository(NomNomContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(RecipeModel recipe)
        {
            recipe.CreatedAt = DateTime.UtcNow;
            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(RecipeModel recipe)
        {
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
        public async Task<List<RecipeModel>> GetAllAsync()
        {
            return await _context.Recipes.ToListAsync();
        }
        public async Task<List<RecipeModel>> GetAllByIdAsync(int id)
        {
            return await _context.Recipes.Where(x => x.IdUser == id).ToListAsync();
        }
        public async Task<RecipeModel?> GetByIdAsync(int id)
        {
            return await _context.Recipes.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<RecipeModel?> GetLastByIdUserAsync(int id)
        {
            return await _context.Recipes.Where(x => x.IdUser == id).OrderBy(x => x.CreatedAt).LastOrDefaultAsync();
        }
        public async Task<int> GetCountRecipeByIdUserAsync(int id)
        {
            return await _context.Recipes.Where(x => x.IdUser == id).CountAsync();
        }
        public async Task UpdateAsync(RecipeModel recipe)
        {
            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }
    }
}

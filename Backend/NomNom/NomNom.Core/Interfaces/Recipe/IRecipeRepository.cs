using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Recipe
{
    public interface IRecipeRepository
    {
        Task CreateAsync(RecipeModel recipe);
        Task<List<RecipeModel>> GetAllAsync();
        Task<List<RecipeModel>> GetAllByIdAsync(int id);
        Task<RecipeModel?> GetByIdAsync(int id);
        Task<int> GetCountRecipeByIdUserAsync(int id);
        Task<RecipeModel?> GetLastByIdUserAsync(int id);
        Task UpdateAsync(RecipeModel recipe);
        Task DeleteAsync(RecipeModel recipe);
    }
}

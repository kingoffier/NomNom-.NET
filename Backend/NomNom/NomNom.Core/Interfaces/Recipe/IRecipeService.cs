using Microsoft.AspNetCore.Http;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Recipe
{
    public interface IRecipeService
    {
        Task CreateAsync(string name,string time,int numberservings,IFormFile resultimage,string category,string? kitchen,string? recipehistory,string ingridients,
            int? calories,int? proteins,int? fats,int? carbs,string? recipetip,int idUser);
        Task<List<RecipeModel>> GetAllCachedAsync();
        Task<List<RecipeModel>> GetRecipesByIdCachedAsync(int id);
        Task<RecipeModel> GetByIdCached(int id);
        Task<RecipeModel> GetLastByIdUserCached(int id);
        Task<int> GetCountRecipesByIdUserCached(int id);
        Task UpdateAsync(int id, string? name, string? time, int? numberservings, IFormFile? resultimage, string? category, string? kitchen, string? recipehistory, string? ingridients, int? calories, int? proteins, int? fats, int? carbs,
            int? likes,int? saves, string? recipetip, int? idUser);
        Task DeleteAsync(int id);
    }
}

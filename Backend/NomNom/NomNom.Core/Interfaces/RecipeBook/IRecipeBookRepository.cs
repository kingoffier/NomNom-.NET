using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.RecipeBook
{
    public interface IRecipeBookRepository
    {
        Task AddToBookAsync(RecipeBookModel recipe);
        Task<List<RecipeBookModel>> GetAllAsync();
        Task<List<RecipeBookModel>> GetAllBookByIdUser(int id);
        Task<RecipeBookModel?> GetByIdAsync(int id);
        Task<RecipeBookModel?> GetByIdUserAsync(int idRecipe,int idUser);
        Task RemoveToBookAsync(RecipeBookModel recipe);
    }
}

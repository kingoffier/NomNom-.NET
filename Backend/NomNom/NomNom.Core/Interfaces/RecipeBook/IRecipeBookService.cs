using Microsoft.AspNetCore.Http;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.RecipeBook
{
    public interface IRecipeBookService
    {
        Task AddToBookAsync(int idRecipe,int idUser);
        Task<List<RecipeBookModel>> GetAllCached();
        Task<RecipeBookModel> GetByIdCached(int id);
        Task<List<RecipeBookModel>> GetAllBookByIdUserCached(int id);
        Task RemoveToBookAsync(int idRecipe,int idUser);
    }
}

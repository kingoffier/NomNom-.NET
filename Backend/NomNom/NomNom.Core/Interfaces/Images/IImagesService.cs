using Microsoft.AspNetCore.Http;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Images
{
    public interface IImagesService
    {
        Task CreateTaskImage(int idRecipe,int idUser,int numberStep,string stepFormula, IFormFile? imageUrl,string imagePreview);
        Task<List<ImagesModel>> GetAllByIdRecipeCached(int idRecipe);
        Task DeleteAsync(int id);
    }
}

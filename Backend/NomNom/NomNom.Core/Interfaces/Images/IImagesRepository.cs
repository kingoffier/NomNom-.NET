using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Images
{
    public interface IImagesRepository
    {
        Task CreateTaskImage(ImagesModel image);
        Task<List<ImagesModel>> GetAllByIdRecipe(int idRecipe);
        Task DeleteAsync(List<ImagesModel> image);
    }
}

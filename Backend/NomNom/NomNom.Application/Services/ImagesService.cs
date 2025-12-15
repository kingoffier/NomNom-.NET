using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.Tokens;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Interfaces.Recipe;
using NomNom.Core.Interfaces.RecipeBook;
using NomNom.Core.Models;
using NomNom.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NomNom.Application.Services
{
    public class ImagesService : IImagesService
    {
        private readonly IImagesRepository _imageRepository;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IDistributedCache _cache;
        public ImagesService(CloudinaryService cloudinaryService, IImagesRepository imageRepository, IDistributedCache cache)
        {
            _imageRepository = imageRepository;
            _cloudinaryService = cloudinaryService;
            _cache = cache;
        }
        public async Task CreateTaskImage(int idRecipe, int idUser, int numberStep,string stepFormula, IFormFile? imageUrl, string ImagePreview)
        {
            if (!string.IsNullOrEmpty(Convert.ToString(idUser)) && !string.IsNullOrEmpty(Convert.ToString(numberStep)))
            {
                if (imageUrl != null)
                {
                    var resultimageUrl = await _cloudinaryService.UploadImageAsync(imageUrl);
                    if (resultimageUrl == null)
                        throw new Exception("Ошибка загрузки изображения");
                    var recipe = new ImagesModel
                    {
                        IdRecipe = idRecipe,
                        IdUser = idUser,
                        NumberStep = numberStep,
                        StepFormula = stepFormula,
                        ImageUrl = resultimageUrl
                    };
                    await _imageRepository.CreateTaskImage(recipe);
                }
                else
                {
                    var recipe = new ImagesModel
                    {
                        IdRecipe = idRecipe,
                        IdUser = idUser,
                        NumberStep = numberStep,
                        StepFormula = stepFormula,
                        ImageUrl = ImagePreview
                    };
                    await _imageRepository.CreateTaskImage(recipe);
                }
            }
            else
            {
                throw new Exception("Не все поля заполнены");
            }
        }
        //public async Task<List<ImagesModel>> GetAllByIdRecipe(int idRecipe)
        //{
        //    var recipe = await _imageRepository.GetAllByIdRecipe(idRecipe);
        //    if (recipe is null)
        //        throw new Exception("У рецепта нету фотографий");
        //    else
        //        return recipe;
        //}
        public async Task<List<ImagesModel>> GetAllByIdRecipeCached(int idRecipe)
        {
            try
            {
                var cacheKey = $"steps_{idRecipe}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<ImagesModel>>(cached);
                }

                var recipe = await _imageRepository.GetAllByIdRecipe(idRecipe);
                if (recipe != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(recipe);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                if (recipe is null)
                    throw new Exception("У рецепта нету фотографий");
                return recipe;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task DeleteAsync(int id)
        {
            var image = await _imageRepository.GetAllByIdRecipe(id);
            if (image is null)
                throw new Exception("Рецепт не найден");
            await _imageRepository.DeleteAsync(image);
        }
    }
}

using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.Tokens;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.Recipe;
using NomNom.Core.Interfaces.User;
using NomNom.Core.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace NomNom.Application.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IDistributedCache _cache;
        public RecipeService(ICloudinaryService cloudinaryService, IRecipeRepository recipeRepository, IDistributedCache cache)
        {
            _recipeRepository = recipeRepository;
            _cloudinaryService = cloudinaryService;
            _cache = cache;
        }
        public async Task CreateAsync(string name, string time, int numberservings, IFormFile resultimage, string category, string? kitchen, string? recipehistory, string ingridients, int? calories, int? proteins, int? fats, int? carbs, string? recipetip, int idUser)
        {
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(time)
                && !string.IsNullOrEmpty(category) && !string.IsNullOrEmpty(ingridients))
            {
                var resultimageUrl = await _cloudinaryService.UploadImageAsync(resultimage);
                if (resultimageUrl == null)
                    throw new Exception("Ошибка загрузки изображения");
                var recipe = new RecipeModel
                {
                    Name = name,
                    Time = time,
                    NumberServings = numberservings,
                    ResultImage = resultimageUrl,
                    Category = category,
                    Kitchen = kitchen,
                    RecipeHistory = recipehistory,
                    Ingridients = ingridients,
                    Calories = calories,
                    Proteins = proteins,
                    Fats = fats,
                    Carbs = carbs,
                    Likes = 0,
                    Saves = 0,
                    RecipeTip = recipetip,
                    IdUser = idUser
                };
                await _recipeRepository.CreateAsync(recipe);
            }
            else
            {
                throw new Exception("Не все поля заполнены");
            }
        }

        public async Task DeleteAsync(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe is null)
                throw new Exception("Пользователь не найден");

            await _recipeRepository.DeleteAsync(recipe);
        }
        //public async Task<List<RecipeModel>> GetAllAsync()
        //{
        //    return await _recipeRepository.GetAllAsync();
        //}
        public async Task<List<RecipeModel>> GetAllCachedAsync()
        {
            try
            {
                var cacheKey = $"recipes";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<RecipeModel>>(cached);
                }

                var recipe = await _recipeRepository.GetAllAsync();
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
                    throw new Exception("Рецепты не найдены");
                return recipe;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<List<RecipeModel>> GetAllByIdAsync(int id)
        //{
        //    var recipes = await _recipeRepository.GetAllByIdAsync(id);
        //    if (recipes is null)
        //        throw new Exception("У пользователя нету рецептов на платформе");
        //    else
        //        return recipes;
        //}
        public async Task<List<RecipeModel>> GetRecipesByIdCachedAsync(int id)
        {
            try
            {
                var cacheKey = $"recipes_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<RecipeModel>>(cached);
                }

                var recipes = await _recipeRepository.GetAllByIdAsync(id);
                if (recipes != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(recipes);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                if (recipes is null)
                    throw new Exception("У пользователя нету рецептов на платформе");
                return recipes;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<RecipeModel> GetByIdAsync(int id)
        //{
        //    var recipe = await _recipeRepository.GetByIdAsync(id);
        //    if (recipe is null)
        //        throw new Exception("Рецепт не найден");
        //    else
        //        return recipe;
        //}
        public async Task<RecipeModel> GetByIdCached(int id)
        {
            try
            {
                var cacheKey = $"recipe_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<RecipeModel>(cached);
                }

                var recipe = await _recipeRepository.GetByIdAsync(id);
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
                    throw new Exception("Рецепт не найден");
                return recipe;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<int> GetCountRecipeByIdUserAsync(int id)
        //{
        //    var recipe = await _recipeRepository.GetCountRecipeByIdUserAsync(id);
        //    if (recipe == 0)
        //        throw new Exception("У пользователя нету рецептов");
        //    else
        //        return recipe;
        //}
        public async Task<int> GetCountRecipesByIdUserCached(int id)
        {
            try
            {
                var cacheKey = $"countRecipes_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<int>(cached);
                }

                var count = await _recipeRepository.GetCountRecipeByIdUserAsync(id);
                if (count != 0)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(count);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                if (count==0)
                    throw new Exception("У пользователя нету рецептов");
                return count;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<RecipeModel> GetLastByIdUserAsync(int id)
        //{
        //    var recipe = await _recipeRepository.GetLastByIdUserAsync(id);
        //    if (recipe is null)
        //        throw new Exception("Рецепт не найден");
        //    else
        //        return recipe;
        //}
        public async Task<RecipeModel> GetLastByIdUserCached(int id)
        {
            try
            {
                var cacheKey = $"lastRecipe_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<RecipeModel>(cached);
                }

                var recipe = await _recipeRepository.GetLastByIdUserAsync(id);
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
                    throw new Exception("Рецепт не найден");
                return recipe;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task UpdateAsync(int id, string? name, string? time, int? numberservings, IFormFile? resultimage, string? category, string? kitchen, string? recipehistory, string? ingridients, int? calories, int? proteins, int? fats, int? carbs,
            int? likes, int? saves, string? recipetip, int? idUser)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id) ?? throw new Exception("Пользователь не найден");
            if (name != null && name != "string")
                recipe.Name = name;
            if (time != null && time != "string")
                recipe.Time = time;
            if (numberservings != null && numberservings != 0)
                recipe.NumberServings = numberservings;
            if (category != null && category != "string")
                recipe.Category = category;
            if (kitchen != null && kitchen != "string")
                recipe.Kitchen = kitchen;
            if (recipehistory != "string")
                recipe.RecipeHistory = recipehistory;
            if (ingridients != null && ingridients != "string")
                recipe.Ingridients = ingridients;
            if (calories != null && calories != 0)
                recipe.Calories = calories;
            if (proteins != null && calories != 0)
                recipe.Proteins = proteins;
            if (fats != null && calories != 0)
                recipe.Fats = fats;
            if (carbs != null && calories != 0)
                recipe.Carbs = carbs;
            if (Convert.ToString(likes) != null && likes != 0)
                recipe.Likes = Convert.ToInt32(likes);
            if (Convert.ToString(saves) != null && saves != 0)
                recipe.Saves = Convert.ToInt32(saves);
            if (recipetip != "string")
                recipe.RecipeTip = recipetip;
            if (Convert.ToString(idUser) != null && idUser != 0)
                recipe.IdUser = Convert.ToInt32(idUser);
            if (resultimage != null)
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(resultimage);
                if (imageUrl == null)
                    throw new Exception("Ошибка загрузки изображения");
                recipe.ResultImage = imageUrl;
            }
            await _recipeRepository.UpdateAsync(recipe);
        }
    }
}

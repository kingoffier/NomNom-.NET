using Microsoft.Extensions.Caching.Distributed;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.RecipeBook;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NomNom.Application.Services
{
    public class RecipeBookService : IRecipeBookService
    {
        private readonly IRecipeBookRepository _recipeBookRepository;
        private readonly IDistributedCache _cache;
        public RecipeBookService(IRecipeBookRepository recipeBookRepository, IDistributedCache cache)
        {
            _recipeBookRepository = recipeBookRepository;
            _cache =cache;
        }
        public async Task AddToBookAsync(int idRecipe, int idUser)
        {
            var recipe = new RecipeBookModel
            {
                IdRecipe = idRecipe,
                IdUser = idUser
            };
            await _recipeBookRepository.AddToBookAsync(recipe);
        }

        //public async Task<List<RecipeBookModel>> GetAllAsync()
        //{
        //    return await _recipeBookRepository.GetAllAsync();
        //}
        public async Task<List<RecipeBookModel>> GetAllCached()
        {
            try
            {
                var cacheKey = $"recipeBook";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<RecipeBookModel>>(cached);
                }

                var book = await _recipeBookRepository.GetAllAsync();
                if (book != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(book);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                return book;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<List<RecipeBookModel>> GetAllBookByIdUser(int id)
        //{
        //    return await _recipeBookRepository.GetAllBookByIdUser(id);
        //}
        public async Task<List<RecipeBookModel>> GetAllBookByIdUserCached(int id)
        {
            try
            {
                var cacheKey = $"allBookByUser_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<RecipeBookModel>>(cached);
                }

                var book = await _recipeBookRepository.GetAllBookByIdUser(id);
                if (book != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(book);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                return book;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<RecipeBookModel> GetByIdAsync(int id)
        //{
        //    var recipe = await _recipeBookRepository.GetByIdAsync(id);
        //    if (recipe is null)
        //        throw new Exception("Рецепт не найден в книге рецептов");
        //    else
        //        return recipe;
        //}
        public async Task<RecipeBookModel> GetByIdCached(int id)
        {
            try
            {
                var cacheKey = $"recipeFromBook_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<RecipeBookModel>(cached);
                }
                var recipe = await _recipeBookRepository.GetByIdAsync(id);
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
                    throw new Exception("Рецепт не найден в книге рецептов");
                return recipe;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task RemoveToBookAsync(int idRecipe,int idUser)
        {
            var res=await _recipeBookRepository.GetByIdUserAsync(idRecipe,idUser);
            if (res == null) throw new Exception("Рецепт не найден в книге рецептов");
            await _recipeBookRepository.RemoveToBookAsync(res);
        }
    }
}


using Microsoft.AspNetCore.Mvc;
using NomNom.Core.Interfaces.Recipe;
using NomNom.Core.Interfaces.User;
using NomNom.Core;
using Microsoft.AspNetCore.Authorization;
using NomNom.API.Contracts.Recipe;

namespace NomNom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController:ControllerBase
    {
        private readonly IRecipeService _recipeService;
        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }
        [HttpPost("createRecipe")]
        public async Task<IActionResult> CreateUserAsync([FromForm] CreateRequest recipe)
        {
            await _recipeService.CreateAsync(recipe.Name,recipe.Time,recipe.Numberservings,recipe.Resultimage,recipe.Category,recipe.Kitchen,recipe.Recipehistory,
                recipe.Ingridients,recipe.Calories,recipe.Proteins,recipe.Fats,recipe.Carbs,recipe.Recipetip,recipe.IdUser);
            return Ok();
        }
        [HttpGet("getAllRecipe")]
        public async Task<IActionResult> GetAllRecipeCachedAsync()
        {
            var recipe = await _recipeService.GetAllCachedAsync();
            if (recipe == null) return NotFound();
            return Ok(recipe);
        }
        [HttpGet("getAllRecipeByIdUser/{id:int}")]
        public async Task<IActionResult> GetAllRecipeByIdUserCached([FromRoute] int id)
        {
            var recipe = await _recipeService.GetRecipesByIdCachedAsync(id);
            if (recipe == null) return NotFound();
            return Ok(recipe);
        }
        [HttpGet("getRecipeById/{id:int}")]
        public async Task<IActionResult> GetRecipeByIdCached([FromRoute] int id)
        {
            var recipe = await _recipeService.GetByIdCached(id);
            if (recipe == null) return NotFound();
            return Ok(recipe);
        }
        [HttpGet("getLastRecipeByIdUser/{id:int}")]
        public async Task<IActionResult> GetLastRecipeByIdUserCached([FromRoute] int id)
        {
            var recipe = await _recipeService.GetLastByIdUserCached(id);
            return Ok(recipe.Id);
        }
        [HttpGet("getCountRecipeByIdUser/{id:int}")]
        public async Task<IActionResult> GetCountRecipesByIdUserCached([FromRoute] int id)
        {
            var recipe = await _recipeService.GetCountRecipesByIdUserCached(id);
            return Ok(recipe);
        }
        [HttpPut("updateRecipe/{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipeAsync(int id,[FromForm] UpdateRequest recipe)
        {
            await _recipeService.UpdateAsync(id, recipe.Name, recipe.Time, recipe.Numberservings, recipe.ResultImage, recipe.Category, recipe.Kitchen, recipe.RecipeHistory,
                recipe.Ingredients, recipe.Calories, recipe.Proteins, recipe.Fats, recipe.Carbs,recipe.Likes,recipe.Saves, recipe.RecipeTip, recipe.IdUser);
            return Ok();
        }
        [HttpDelete("deleteRecipe/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipeAsync([FromRoute] int id)
        {
            await _recipeService.DeleteAsync(id);
            return Ok();
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NomNom.API.Contracts.Images;
using NomNom.API.Contracts.RecipeBook;
using NomNom.Application.Services;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Interfaces.Recipe;
using NomNom.Core.Interfaces.RecipeBook;

namespace NomNom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeBookController : ControllerBase
    {
        private readonly IRecipeBookService _recipeBookService;
        public RecipeBookController(IRecipeBookService recipeBookService)
        {
            _recipeBookService = recipeBookService;
        }
        [HttpPost("addToBookAsync")]
        [Authorize]
        public async Task<IActionResult> AddToBookAsync([FromForm] RecipeBookRequest recipe)
        {
            await _recipeBookService.AddToBookAsync(recipe.IdRecipe,recipe.IdUser);
            return Ok();
        }
        [HttpGet("getAllBook")]
        public async Task<IActionResult> GetAllBookCached()
        {
            var recipe = await _recipeBookService.GetAllCached();
            return Ok(recipe);
        }
        [HttpGet("getRecipeBookByIdUser/{id:int}")]
        public async Task<IActionResult> GetRecipeBookByIdUserCached([FromRoute] int id)
        {
            var recipe = await _recipeBookService.GetByIdCached(id);
            return Ok(recipe);
        }
        [HttpGet("getAllRecipeBookByIdUser/{id:int}")]
        public async Task<IActionResult> GetAllRecipeBookByIdUserCached([FromRoute] int id)
        {
            var recipe = await _recipeBookService.GetAllBookByIdUserCached(id);
            return Ok(recipe);
        }
        [HttpDelete("removeToBookAsync")]
        public async Task<IActionResult> RemoveToBookAsync([FromBody] RecipeBookRequest recipe)
        {
            await _recipeBookService.RemoveToBookAsync(recipe.IdRecipe,recipe.IdUser);
            return Ok();
        }
    }
}

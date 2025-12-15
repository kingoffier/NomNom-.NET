using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NomNom.API.Contracts.Images;
using NomNom.Application;
using NomNom.Application.Services;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Interfaces.Recipe;

namespace NomNom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController:ControllerBase
    {
        private readonly IImagesService _imageService;
        public ImagesController(IImagesService imageService)
        {
            _imageService = imageService;
        }
        [HttpPost("createStep")]
        [Authorize]
        public async Task<IActionResult> CreateStep([FromForm] ImagesRequest steps)
        {
            await _imageService.CreateTaskImage(steps.IdRecipe,steps.IdUser,steps.NumberStep, steps.StepFormula,steps.ImageUrl,steps.ImagePreview);
            return Ok();
        }
        [HttpGet("getAllByIdRecipe/{id:int}")]
        public async Task<IActionResult> GetAllStepsByIdRecipeCached([FromRoute] int id)
        {
            var recipes = await _imageService.GetAllByIdRecipeCached(id);
            return Ok(recipes);
        }
        [HttpDelete("deleteStepsByIdRecipe/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteStepsByIdRecipe([FromRoute] int id)
        {
            await _imageService.DeleteAsync(id);
            return Ok();
        }
    }
}

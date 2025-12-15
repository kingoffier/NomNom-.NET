namespace NomNom.API.Contracts.Images
{
    public record ImagesRequest(int IdRecipe, int IdUser, int NumberStep, string StepFormula, IFormFile? ImageUrl,string ImagePreview);
}

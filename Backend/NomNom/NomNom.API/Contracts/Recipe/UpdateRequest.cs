namespace NomNom.API.Contracts.Recipe
{
    public record UpdateRequest(
     string? Name,
     string? Time,
     int? Numberservings,
     IFormFile? ResultImage,
     string? Category,
     string? Kitchen,
     string? RecipeHistory,
     string? Ingredients,
     int? Calories,
     int? Proteins,
     int? Fats,
     int? Carbs,
     int? Likes,
     int? Saves,
     string? RecipeTip,
     int IdUser
        );

}

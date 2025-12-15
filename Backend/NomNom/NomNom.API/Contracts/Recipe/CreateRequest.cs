namespace NomNom.API.Contracts.Recipe
{
    public record CreateRequest(string Name,
     string Time,
     int Numberservings,
     IFormFile Resultimage,
     string Category,
     string? Kitchen,
     string? Recipehistory,
     string Ingridients,
     int? Calories,
     int? Proteins,
     int? Fats,
     int? Carbs,
     string? Recipetip,
     int IdUser);

}

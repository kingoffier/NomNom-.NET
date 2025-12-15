using NomNom.Core.Models;

namespace NomNom.Core
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? SecondName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AvatarURL { get; set; } = string.Empty;
        public int Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<RecipeModel> Recipes { get; set; } = new List<RecipeModel>();
        public ICollection<RecipeBookModel> RecipeBooks { get; set; } = new List<RecipeBookModel>();
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Models
{
    public class RecipeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public int? NumberServings {  get; set; }
        public string ResultImage { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Kitchen { get; set; }
        public string? RecipeHistory { get; set; }
        public string Ingridients { get; set; } = string.Empty;
        public int? Calories { get; set; }
        public int? Proteins { get; set; }
        public int? Fats { get; set; }
        public int? Carbs { get; set; }
        public int Likes { get; set; }
        public int Saves { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? RecipeTip { get; set; }
        public int IdUser { get; set; }
        public virtual UserModel? User { get; set; }
        public ICollection<ImagesModel> Images { get; set; } = new List<ImagesModel>();
        public ICollection<RecipeBookModel> RecipeBooks { get; set; } = new List<RecipeBookModel>();
    }
}

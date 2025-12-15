using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace NomNom.Core.Models
{
    public class RecipeBookModel
    {
        public int Id { get; set; }
        public int IdRecipe { get; set; }
        public int IdUser { get; set; }
        [JsonIgnore]
        public RecipeModel? Recipe { get; set; }
        [JsonIgnore]
        public UserModel? User { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Models
{
    public class ImagesModel
    {
        public int Id { get; set; }
        public int IdRecipe { get; set; }
        public int IdUser {  get; set; }
        public int NumberStep {  get; set; }
        public string StepFormula {  get; set; } = string.Empty;
        public string ImageUrl {  get; set; } = string.Empty;
        public RecipeModel? Recipe { get; set; }
    }
}

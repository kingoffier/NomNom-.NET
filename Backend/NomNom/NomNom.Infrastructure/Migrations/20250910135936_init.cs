using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NomNom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SecondName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Login = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvatarURL = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recipe",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Time = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    NumberServings = table.Column<int>(type: "int", nullable: true),
                    ResultImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Kitchen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RecipeHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ingridients = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Calories = table.Column<int>(type: "int", nullable: true),
                    Proteins = table.Column<int>(type: "int", nullable: true),
                    Fats = table.Column<int>(type: "int", nullable: true),
                    Carbs = table.Column<int>(type: "int", nullable: true),
                    Likes = table.Column<int>(type: "int", nullable: false),
                    Saves = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecipeTip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdUser = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipe", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recipe_User",
                        column: x => x.IdUser,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdRecipe = table.Column<int>(type: "int", nullable: false),
                    IdUser = table.Column<int>(type: "int", nullable: false),
                    NumberStep = table.Column<int>(type: "int", nullable: false),
                    StepFormula = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Images_Recipe",
                        column: x => x.IdRecipe,
                        principalTable: "Recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecipeBook",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdRecipe = table.Column<int>(type: "int", nullable: false),
                    IdUser = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeBook", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeBook_Recipe",
                        column: x => x.IdRecipe,
                        principalTable: "Recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeBook_User",
                        column: x => x.IdUser,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Images_IdRecipe",
                table: "Images",
                column: "IdRecipe");

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_IdUser",
                table: "Recipe",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeBook_IdRecipe",
                table: "RecipeBook",
                column: "IdRecipe");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeBook_IdUser",
                table: "RecipeBook",
                column: "IdUser");
			migrationBuilder.Sql(@"
				INSERT INTO [User] ([FirstName], [SecondName], [Email], [Login], [Password], [AvatarURL], [Role], [CreatedAt])
				VALUES ('Артём', 'Воложанин', 'kingoffier@mail.ru', 'kingoffier', '$2a$11$Ru3ChAaxRr7/8ihcd3bOmeIFK.hI1OthHyoQFs4noCWCLaWdq22UC', 'https://...', 1, '2025-09-10T19:01:17.1453410');
			");
			migrationBuilder.Sql(@"
				INSERT INTO [Recipe] ([Name], [Time], [NumberServings], [ResultImage], [Category], [Kitchen], [RecipeHistory], [Ingridients], [Calories], [Proteins], [Fats], [Carbs], [Likes], [Saves], [CreatedAt], [RecipeTip], [IdUser])
				VALUES ('Сырники из творога', '0:30', 2, 'https://res.cloudinary.com/dzgmeqs7u/image/upload/v1754822679/my_images/proverka_rwokx9.jpg', 'Завтраки', 'Русская кухня', '...', '...', 938, 42, 61, 56, 0, 40, '2025-08-25T00:00:00.0000000', NULL, 1);
			");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "RecipeBook");

            migrationBuilder.DropTable(
                name: "Recipe");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}

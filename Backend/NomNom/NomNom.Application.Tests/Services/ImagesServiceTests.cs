using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using NomNom.Application.Services;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Models;
using NomNom.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NomNom.Application.Tests.Services
{
    public class ImagesServiceTests
    {
        private readonly Mock<IImagesRepository> _imageRepositoryMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly Mock<IDistributedCache> _cacheMock;

        private readonly ImagesService _imageService;
        public ImagesServiceTests()
        {
            _imageRepositoryMock = new Mock<IImagesRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _cacheMock = new Mock<IDistributedCache>();

            _imageService = new ImagesService(
                _cloudinaryServiceMock.Object,
                _imageRepositoryMock.Object,
                _cacheMock.Object
                );
        }

        [Fact]
        public async Task CreateTaskImage_ValidData_ShouldCreateTask()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            _cloudinaryServiceMock
                .Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>()))
                .ReturnsAsync("http://image.url/avatar.png");
            // Act
            await _imageService.CreateTaskImage(
                idRecipe: 1,
                idUser: 1,
                numberStep: 1,
                stepFormula: "test",
                imageUrl: fileMock.Object,
                ImagePreview: "preview");
            // Assert
            _imageRepositoryMock.Verify(
                x => x.CreateTaskImage(It.Is<ImagesModel>(u =>
                    u.IdRecipe == 1 &&
                    u.IdUser == 1 &&
                    u.NumberStep == 1 &&
                    u.StepFormula == "test" &&
                    u.ImageUrl == "http://image.url/avatar.png")),
                Times.Once);
        }
        [Fact]
        public async Task GetAllByIdRecipeCached_ValidData_ShouldReturnFromCache()
        {
            // Arrange
            int idRecipe = 1;
            var cacheKey = $"steps_{idRecipe}";

            var recipe = new List<ImagesModel>
            {
                new ImagesModel
                {
                    Id = 1,
                    IdRecipe = idRecipe,
                    IdUser = 1,
                    NumberStep = 1,
                    StepFormula = "test",
                    ImageUrl = "http://image.url/avatar.png"
                }
            };

            var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(recipe);

            _cacheMock
                .Setup(x => x.GetAsync(
                    cacheKey,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(cachedBytes);

            // Act
            var result = await _imageService.GetAllByIdRecipeCached(idRecipe);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(idRecipe, result[0].IdRecipe);

            _imageRepositoryMock.Verify(
                x => x.GetAllByIdRecipe(It.IsAny<int>()),
                Times.Never);
        }
        [Fact]
        public async Task DeleteAsync_ValidData_ShouldBeTrue()
        {
            var idRecipe = 1;
            var recipe = new List<ImagesModel>
            {
                new ImagesModel
                {
                    Id = 1,
                    IdRecipe = idRecipe,
                    IdUser = 1,
                    NumberStep = 1,
                    StepFormula = "test",
                    ImageUrl = "http://image.url/avatar.png"
                }
            };
            _imageRepositoryMock
                .Setup(x => x.GetAllByIdRecipe(idRecipe))
                .ReturnsAsync(recipe);

            await _imageService.DeleteAsync(idRecipe);

            _imageRepositoryMock.Verify(
                x => x.DeleteAsync(It.Is<List<ImagesModel>>(list =>
            ReferenceEquals(list, recipe))), Times.Once);
        }
        [Fact]
        public async Task DeleteAsync_RecipeNotFound_ShouldThrowException()
        {
            var idRecipe = 1;
            _imageRepositoryMock.Setup(x => x.GetAllByIdRecipe(idRecipe)).ReturnsAsync((List<ImagesModel>?)null);
            await Assert.ThrowsAsync<Exception>(
                () => _imageService.DeleteAsync(idRecipe));
        }
    }
}

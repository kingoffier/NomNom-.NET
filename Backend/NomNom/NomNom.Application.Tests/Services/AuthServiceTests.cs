using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json.Linq;
using NomNom.Application.Services;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Application.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IAuthRepository> _authRepositoryMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly Mock<IJwtService> _jwtServiceMock;

        private readonly AuthService _authService;
        public AuthServiceTests()
        {
            _authRepositoryMock = new Mock<IAuthRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _jwtServiceMock = new Mock<IJwtService>();

            _authService = new AuthService(
                _cloudinaryServiceMock.Object,
                _authRepositoryMock.Object,
                _jwtServiceMock.Object
                );
        }
        [Fact]
        public async Task Register_ValidData_ShouldAddUser()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();

            _cloudinaryServiceMock
                .Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>()))
                .ReturnsAsync("http://image.url/avatar.png");

            // Act
            await _authService.Register(
                firstname: "Ivan",
                secondname: "Ivanov",
                email: "test@mail.com",
                login: "ivan",
                password: "password123",
                image: fileMock.Object);

            // Assert
            _authRepositoryMock.Verify(
                x => x.Add(It.Is<UserModel>(u =>
                    u.Login == "ivan" &&
                    u.Email == "test@mail.com" &&
                    u.AvatarURL == "http://image.url/avatar.png")),
                Times.Once);
        }
        [Fact]
        public async Task Login_ValidCredentials_ShouldReturnToken()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(password);

            var user = new UserModel
            {
                Login = "testlogin",
                Password = hashedPassword
            };

            _authRepositoryMock
                .Setup(x => x.GetByUserName("testlogin"))
                .Returns(user);

            _jwtServiceMock
                .Setup(x => x.GenerateToken(It.IsAny<UserModel>()))
                .Returns("fake-jwt-token");

            // Act
            var token = await _authService.Login("testlogin", password);

            // Assert
            token.Should().Be("fake-jwt-token");
            _jwtServiceMock.Verify(
                x => x.GenerateToken(It.Is<UserModel>(u => u.Login == "testlogin")),
                Times.Once);
        }

    }
}

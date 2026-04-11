using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using NomNom.Application.Services;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.User;
using NomNom.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NomNom.Application.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly Mock<IDistributedCache> _cacheMock;

        public readonly UserService _userService;
        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _cacheMock = new Mock<IDistributedCache>();

            _userService = new UserService(
                _cloudinaryServiceMock.Object,
                _userRepositoryMock.Object,
                _cacheMock.Object
                );
        }

        [Fact]
        public async Task GetAllUsersCached_WhenCacheHit_ShouldReturnUsersFromCache()
        {
            var cacheKey = $"users";
            var user = new List<UserModel>
            {
                new UserModel
                {
                    Id = 1,
                    SecondName = "Test",
                    AvatarURL="test",
                    CreatedAt= DateTime.Now,
                    Email="test",
                    FirstName="Test",
                    Login = "test",
                    Password="test",
                    Role=1
                }
            };
            var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(user);
            _cacheMock.Setup(x => x.GetAsync(cacheKey, It.IsAny<CancellationToken>())).ReturnsAsync(cachedBytes);

            var users = await _userService.GetAllUsersCached();

            Assert.NotNull(users);
            Assert.Equal(1, users[0].Id);
            Assert.Equal("test", users[0].Login);

            _userRepositoryMock.Verify(x => x.GetAllAsync(), Times.Never());
        }
        [Fact]
        public async Task GetAllUsersCached_WhenCacheNull_ShouldReturnUsersFrom()
        {
            var cacheKey = $"users";
            var user = new List<UserModel>
            {
                new UserModel
                {
                    Id = 1,
                    SecondName = "Test",
                    AvatarURL="test",
                    CreatedAt= DateTime.Now,
                    Email="test",
                    FirstName="Test",
                    Login = "test",
                    Password="test",
                    Role=1
                }
            };
            var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(user);
            _cacheMock.Setup(x => x.GetAsync(cacheKey, It.IsAny<CancellationToken>())).ReturnsAsync((byte[]?)null);
            _userRepositoryMock
            .Setup(x => x.GetAllAsync())
            .ReturnsAsync(user);

            var users = await _userService.GetAllUsersCached();

            Assert.NotNull(users);
            Assert.Equal(1, users[0].Id);
            Assert.Equal("test", users[0].Login);

            _userRepositoryMock.Verify(x => x.GetAllAsync(), Times.Once);
            _cacheMock.Verify(
                x => x.SetAsync(
                    cacheKey,
                    It.IsAny<byte[]>(),
                    It.IsAny<DistributedCacheEntryOptions>(),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
        [Fact]
        public async Task UpdateUser_ValidData_ShouldBeTrue()
        {
            var fileMock = new Mock<IFormFile>();
            int userId = 1;
            var user = new UserModel
            {
                Id = userId,
                FirstName = "OldFirst",
                SecondName = "OldSecond",
                Email = "old@email.com",
                Login = "oldLogin",
                Password = "oldPassword",
                AvatarURL = "oldAvatar",
                Role = 1,
                CreatedAt = DateTime.UtcNow
            };
            _userRepositoryMock.Setup(x => x.GetByIdAsync(userId)).ReturnsAsync(user);
            _cloudinaryServiceMock.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>())).ReturnsAsync("http://image.url/avatar.png");

            await _userService.UpdateAsync(
                id: userId,
                newFirstname: "NewFirst",
                newSecondname: "NewSecond",
                newEmail: "new@email.com",
                newLogin: "newLogin",
                newPassword: "newPassword",
                newAvatar: fileMock.Object);

            _userRepositoryMock.Verify(x => x.UpdateAsync(It.Is<UserModel>(
                u => u.Id == userId &&
                u.FirstName == "NewFirst" &&
                u.SecondName == "NewSecond" &&
                u.Email == "new@email.com" &&
                u.Login == "newLogin" &&
                u.Password == "newPassword" &&
                u.AvatarURL == "http://image.url/avatar.png")), Times.Once);
            _cloudinaryServiceMock.Verify(
            x => x.UploadImageAsync(It.IsAny<IFormFile>()),
            Times.Once);

        }
        [Fact]
        public async Task GetByIdCached_CacheHit_ShouldReturnCache()
        {
            int id = 1;
            var cacheKey = $"user_{id}";
            var user = new UserModel
            {
                Id = 1,
                SecondName = "Test",
                AvatarURL = "test",
                CreatedAt = DateTime.Now,
                Email = "test",
                FirstName = "Test",
                Login = "test",
                Password = "test",
                Role = 1
            };
            var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(user);
            _cacheMock
                .Setup(x => x.GetAsync(cacheKey, It.IsAny<CancellationToken>()))
                .ReturnsAsync(cachedBytes);
            _userRepositoryMock
                .Setup(x => x.GetByIdAsync(id))
                .ReturnsAsync(user);

            var res = await _userService.GetByIdCached(id);

            Assert.NotNull(res);
            Assert.Equal(id, res.Id);
            
            _userRepositoryMock.Verify(x => x.GetByIdAsync(It.IsAny<int>()), Times.Never);
            _cacheMock.Verify(
                x => x.SetAsync(
                    cacheKey,
                    It.IsAny<byte[]>(),
                    It.IsAny<DistributedCacheEntryOptions>(),
                    It.IsAny<CancellationToken>()),
                Times.Never);
        }
        [Fact]
        public async Task GetByIdCached_CacheMiss_ShouldReturnUser()
        {
            int id = 1;
            var cacheKey = $"user_{id}";
            var user = new UserModel
            {
                Id = 1,
                SecondName = "Test",
                AvatarURL = "test",
                CreatedAt = DateTime.Now,
                Email = "test",
                FirstName = "Test",
                Login = "test",
                Password = "test",
                Role = 1
            };
            var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(user);
            _cacheMock
                .Setup(x => x.GetAsync(cacheKey, It.IsAny<CancellationToken>()))
                .ReturnsAsync((byte[]?)null);
            _userRepositoryMock
                .Setup(x => x.GetByIdAsync(id))
                .ReturnsAsync(user);

            var res = await _userService.GetByIdCached(id);

            Assert.NotNull(res);
            Assert.Equal(id, res.Id);

            _userRepositoryMock.Verify(x => x.GetByIdAsync(It.IsAny<int>()), Times.Once);
            _cacheMock.Verify(
                x => x.SetAsync(
                    cacheKey,
                    It.IsAny<byte[]>(),
                    It.IsAny<DistributedCacheEntryOptions>(),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}

using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Caching.Distributed;
using NomNom.Core;
using NomNom.Core.Interfaces.User;
using NomNom.Core.Models;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;

namespace NomNom.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IDistributedCache _cache;
        public UserService(CloudinaryService cloudinaryService, IUserRepository userRepository, IDistributedCache cache)
        {
            _userRepository = userRepository;
            _cloudinaryService = cloudinaryService;
            _cache = cache;
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null)
                throw new Exception("Пользователь не найден");

            await _userRepository.DeleteAsync(user);
        }

        //public async Task<List<UserModel>> GetAllAsync()
        //{
        //    return await _userRepository.GetAllAsync();
        //}
        public async Task<List<UserModel>> GetAllUsersCached()
        {
            try
            {
                var cacheKey = $"users";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<UserModel>>(cached);
                }

                var users = await _userRepository.GetAllAsync();
                if (users != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(users);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                return users;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //public async Task<UserModel> GetByIdAsync(int id)
        //{
        //    var user = await _userRepository.GetByIdAsync(id);
        //    if (user is null)
        //        throw new Exception("Пользователь не найден");
        //    else
        //        return user;
        //}
        public async Task<UserModel> GetByIdCached(int id)
        {
            try
            {
                var cacheKey = $"user_{id}";
                var cached = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<UserModel>(cached);
                }

                var user = await _userRepository.GetByIdAsync(id);
                if (user != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                    };
                    var json = JsonSerializer.Serialize(user);
                    await _cache.SetStringAsync(cacheKey, json, options);
                }
                if (user is null)
                    throw new Exception("Пользователь не найден");
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task UpdateAsync(int id, string? newFirstname, string? newSecondname, string? newEmail, string? newLogin, string? newPassword, IFormFile? newAvatar)
        {
            var user = await _userRepository.GetByIdAsync(id) ?? throw new Exception("Пользователь не найден");

            if (newFirstname != null)
                user.FirstName = newFirstname;
            if (newSecondname != null)
                user.SecondName = newSecondname;
            if (newEmail != null)
                user.Email = newEmail;
            if (newLogin != null)
                user.Login = newLogin;
            if (newAvatar != null)
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(newAvatar);
                if (imageUrl == null)
                    throw new Exception("Ошибка загрузки изображения");
                user.AvatarURL = imageUrl;
            }
            if (newPassword != null)
                user.Password = newPassword;
            await _userRepository.UpdateAsync(user);
        }
    }
}

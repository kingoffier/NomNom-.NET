using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.Images;
using NomNom.Core.Interfaces.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IJwtService _jwtService;
        public AuthService(CloudinaryService cloudinaryService, IAuthRepository authRepository, IJwtService jwtService)
        {
            _authRepository = authRepository;
            _cloudinaryService = cloudinaryService;
            _jwtService = jwtService;
        }
        public async Task Register(string firstname, string? secondname, string email, string login, string password, [FromForm] IFormFile image)
        {
            var hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(password);
            var imageUrl = await _cloudinaryService.UploadImageAsync(image) ?? throw new Exception("Ошибка загрузки изображения");
            var account = new UserModel()
            {
                FirstName = firstname,
                SecondName = secondname,
                Email = email,
                Login = login,
                Password = hashedPassword,
                AvatarURL = imageUrl,
                Role = 1,
                CreatedAt = DateTime.Now,
            };
            await _authRepository.Add(account);
        }
        public async Task<string> Login(string login, string password)
        {
            var account=_authRepository.GetByUserName(login);
            if (account == null)
                throw new Exception("Аккаунт не существует");
            var hashedPassword = BCrypt.Net.BCrypt.EnhancedVerify(password, account.Password);
            if (hashedPassword == false)
                throw new Exception("Неправильный пароль");
            var token = _jwtService.GenerateToken(account);
            return token;
        }
    }
}

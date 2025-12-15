using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NomNom.API.Contracts.Auth;
using NomNom.Application.Services;
using NomNom.Core.Interfaces.Auth;
using NomNom.Core.Interfaces.User;
using NomNom.Infrastructure.Repositories;
using System.Security.Claims;

namespace NomNom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAuthRepository _authRepository;
        public AuthController(IAuthService authService, IAuthRepository authRepository)
        {
            _authService = authService;
            _authRepository = authRepository;
        }
        [HttpPost("register")]
        public async Task<IActionResult> CreateUserAsync([FromForm] RegRequest user)
        {
            var check = _authRepository.GetByUserName(user.Login);
            if (check != null)
            {
                return BadRequest(new { message = "Пользователь с таким логином уже существует" });
            }
            else
            {
                await _authService.Register(user.Firstname, user.Secondname, user.Email, user.Login, user.Password, user.Avatar);
                return Ok();
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginRequest user)
        {
            var token = await _authService.Login(user.Login, user.Password);
            HttpContext.Response.Cookies.Append("tasty-cookies", token);
            return Ok(token);
        }
        [Authorize]
        [HttpGet("userInfo")]
        public IActionResult UserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name);
            return Ok(new { userId, userName });
        }
    }
}

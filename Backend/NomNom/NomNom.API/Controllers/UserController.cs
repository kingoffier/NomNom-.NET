using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NomNom.Core;
using NomNom.Core.Interfaces.User;

namespace NomNom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController:ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService) 
        {
            _userService = userService;
        } 
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllUserCached()
        {
            var user = await _userService.GetAllUsersCached();
            return Ok(user);
        }
        [HttpGet("getById/{id:int}")]
        public async Task<IActionResult> GetByIdCached([FromRoute] int id)
        {
            var users = await _userService.GetByIdCached(id);
            return Ok(users);
        }
        [HttpPut("updateUser/{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateUserAsync([FromRoute] int id,string? newFirstname, string? newSecondname,
            string? newEmail,string? newLogin,string? newPassword, IFormFile? avatar)
        {
            await _userService.UpdateAsync(id, newFirstname,newSecondname,newEmail,newLogin,newPassword, avatar);
            return Ok();
        }
        [HttpDelete("deleteUser/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] int id)
        {
            await _userService.DeleteAsync(id);
            return Ok();
        }
    }
}

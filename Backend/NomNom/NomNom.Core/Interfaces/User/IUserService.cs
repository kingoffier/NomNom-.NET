using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace NomNom.Core.Interfaces.User
{
    public interface IUserService
    {
        Task<List<UserModel>?> GetAllUsersCached();
        Task<UserModel> GetByIdCached(int id);
        Task UpdateAsync(int id,string? newFirstname, string? newSecondname, string? newEmail, string? newLogin, string? newPassword, IFormFile? newAvatar);
        Task DeleteAsync(int id);   
    }
}

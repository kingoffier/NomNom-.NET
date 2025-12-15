using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using NomNom.Core.Models;
namespace NomNom.Core.Interfaces.User
{
    public interface IUserRepository
    {
        Task <List<UserModel>> GetAllAsync();
        Task<UserModel?> GetByIdAsync(int id);
        Task UpdateAsync(UserModel user);
        Task DeleteAsync(UserModel user);
    }
}

using CloudinaryDotNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Auth
{
    public interface IAuthRepository
    {
        Task Add(UserModel user);
        UserModel? GetByUserName(string userName);
    }
}

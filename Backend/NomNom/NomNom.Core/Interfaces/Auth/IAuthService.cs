using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Core.Interfaces.Auth
{
    public interface IAuthService
    {
        Task Register(string firstname, string? secondname, string email, string login, string password, IFormFile image);
        Task<string> Login(string login, string password);
        //string Generate(string password);
        //bool Verify(string password,string hashedPassword);
    }
}

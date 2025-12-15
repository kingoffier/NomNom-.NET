using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Repositories
{
    public class AuthtRepository : IAuthRepository
    {
        private readonly NomNomContext _context;
        public AuthtRepository(NomNomContext context)
        {
            _context = context;
        }
        public async Task Add(UserModel user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public UserModel? GetByUserName(string userName)
        {
            var res= _context.Users.FirstOrDefault(x=>x.Login==userName);
            return res;
        }
    }
}

using Microsoft.EntityFrameworkCore;
using NomNom.Core;
using NomNom.Core.Interfaces.User;
using NomNom.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly NomNomContext _context;
        public UserRepository(NomNomContext context)
        {
            _context = context;
        }

        public async Task<List<UserModel>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<UserModel?> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task UpdateAsync(UserModel user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(UserModel user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}

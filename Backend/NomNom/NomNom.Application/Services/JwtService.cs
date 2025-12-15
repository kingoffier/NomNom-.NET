using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NomNom.Core;
using NomNom.Core.Interfaces.Auth;
using NomNom.Infrastructure;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace NomNom.Application.Services
{
    public class JwtService:IJwtService
    {
        private readonly JwtOptions _options;

        public JwtService(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }
        public string GenerateToken(UserModel user)
        {
            Claim[] claims = [new(ClaimTypes.NameIdentifier, user.Id.ToString()), new(ClaimTypes.Name, user.Login, ToString())];
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
                SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims:claims,
                signingCredentials:signingCredentials,
                expires:DateTime.UtcNow.AddHours(_options.ExpiresHours)
                );
            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
            return tokenValue;
        }
    }
}

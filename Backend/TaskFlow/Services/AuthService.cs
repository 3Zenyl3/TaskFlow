using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using TaskFlow.Data;
using TaskFlow.Entities;

namespace TaskFlow.Services
{
    public class AuthService
    {
        private ApplicationDbContext context;
        private IPasswordHasher<User> passwordHasher;
        private IConfiguration configuration;

        public AuthService(ApplicationDbContext context, IPasswordHasher<User> passwordHasher, IConfiguration configuration)
        {
            this.context = context;
            this.passwordHasher = passwordHasher;
            this.configuration = configuration;
        }
        public async Task<bool> RegisterUser(string email, string userName, string password)
        {
            email = email.Trim().ToLower();
            var userInBd = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (userInBd == null)
            {
                
                var user = new User
                {
                    UserName = userName,
                    Email = email,
                    CreatedAt = DateTime.UtcNow,
                };
                var passwordHash = passwordHasher.HashPassword(user, password);
                user.PasswordHash = passwordHash;
                context.Users.Add(user);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<User> Login(string email, string password)
        {
            var userInBd = await context.Users.FirstOrDefaultAsync(x =>x.Email == email);
            if (userInBd == null)
            {
                throw new AuthenticationException("Пользователя не существует");
            }
            if(passwordHasher.VerifyHashedPassword(userInBd, userInBd.PasswordHash, password) == PasswordVerificationResult.Failed)
            {
                throw new AuthenticationException("Пароль не верный");
            }
            return userInBd;
        }

        public string GenerateJwtToken(User user)
        {
            var claim = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claim,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
                );
            return token.ToString();
        }
    }
}

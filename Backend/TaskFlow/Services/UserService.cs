using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class UserService : IUserService
    {
        private ApplicationDbContext context;

        public UserService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
            return user;
        }
    }
}

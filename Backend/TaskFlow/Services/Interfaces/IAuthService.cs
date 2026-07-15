using TaskFlow.Entities;

namespace TaskFlow.Services.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterUser(string email, string userName, string password);
        Task<User> Login(string email, string password);
        string GenerateJwtToken(User user);
    }
}

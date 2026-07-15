using TaskFlow.Entities;

namespace TaskFlow.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserByEmail(string email);
    }
}

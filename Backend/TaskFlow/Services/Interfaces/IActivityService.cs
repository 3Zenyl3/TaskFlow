using TaskFlow.Models.DTO;

namespace TaskFlow.Services.Interfaces
{
    public interface IActivityService
    {
        Task<List<ActivityDTO>> GetTeamActivity(int userId);
    }
}

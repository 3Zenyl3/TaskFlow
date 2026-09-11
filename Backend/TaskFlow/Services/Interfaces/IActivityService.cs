using TaskFlow.Models.DTO;

namespace TaskFlow.Services.Interfaces
{
    public interface IActivityService
    {
        Task<List<ActivityDTO>> GetTeamActivity(int userId);
        Task CreateActivity(int userId,
            ActivityType activityType,
            string description,
            int? projectId,
            int? taskId);
    }
}

using TaskFlow.Entities;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;

namespace TaskFlow.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskDto>> GetMyTasks(int userId);
        Task<List<TaskDto>> GetMyCreatedTasks(int userId);
        Task<TaskDto?> GetTaskById(int taskId, int userId);
        Task<int> CreateTask(CreateTaskRequest request, int userId);
        Task<StatusTask> UpdateTaskStatus(int taskId, UpdateTaskStatusRequest request, int userId);
        System.Threading.Tasks.Task DeleteTask(int taskId, int userId);
    }
}

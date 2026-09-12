using TaskFlow.Entities;

namespace TaskFlow.Services.Interfaces
{
    public interface IProjectPermissionService
    {
        Task<bool> HasPermission(int userId, int projectId, ProjectPermission permission);
    }
}

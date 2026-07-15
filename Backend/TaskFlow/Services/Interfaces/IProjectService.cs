using TaskFlow.Entities;
using TaskFlow.Models;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;

namespace TaskFlow.Services.Interfaces
{
    public interface IProjectService
    {
        Task<List<ProjectListDto>> GetAllProjectUser(int userId);
        Task<ProjectDetailsDto?> GetCurrentProject(int projectId, int userId);
        Task<ProjectCreateDto> CreateProject(User user, CreateProjectRequest request);
        Task<UpdateProjectResponse> UpdateProject(UpdateProjectRequest request, int userId, int projectId);
        Task<ProjectOperationResult> DeleteProject(int userId, int projectId);
    }
}

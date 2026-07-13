using TaskFlow.Entities;
using static TaskFlow.Services.ProjectService;

namespace TaskFlow.Models.DTO
{
    public class UpdateProjectResponse
    {
        public Services.ProjectService.ProjectOperationResult UpdateProjectResult {  get; set; }
        public Project? Project { get; set; }
    }
}

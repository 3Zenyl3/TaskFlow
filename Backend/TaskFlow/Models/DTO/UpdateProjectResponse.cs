using TaskFlow.Entities;


namespace TaskFlow.Models.DTO
{
    public class UpdateProjectResponse
    {
        public ProjectOperationResult UpdateProjectResult {  get; set; }
        public ProjectCreateDto? Project { get; set; }
    }
}

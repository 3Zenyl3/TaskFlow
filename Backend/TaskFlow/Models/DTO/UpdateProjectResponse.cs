using TaskFlow.Entities;


namespace TaskFlow.Models.DTO
{
    public class UpdateProjectResponse
    {
        public ProjectOperationResult UpdateProjectResult {  get; set; }
        public Project? Project { get; set; }
    }
}

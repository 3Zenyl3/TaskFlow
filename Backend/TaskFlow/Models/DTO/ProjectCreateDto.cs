using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectCreateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public StatusProject Status { get; set; }
    }
}

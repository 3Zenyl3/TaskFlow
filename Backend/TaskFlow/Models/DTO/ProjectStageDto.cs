using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectStageDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Position { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

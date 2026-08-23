using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectStageDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Icon { get; set; }
        public ProjectColor ColorStage { get; set; }
        public int Position { get; set; }
        public int CompletedTasks { get; set; }
        public int TotalTasks { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}

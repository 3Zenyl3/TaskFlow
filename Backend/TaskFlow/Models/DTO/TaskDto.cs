using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Key { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public StatusTask Status { get; set; }
        public Priority Priority { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime StartDate { get; set; }
        public string ProjectName { get; set; }
        public string ExecutorName { get; set; }
        public int ExecutorId { get; set; }
        public int? StageId { get; set; }
        public string? StageName { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public List<CommentDTO> Comments { get; set; } = new List<CommentDTO>();
        public TaskType Type { get; set; }
    }
}

using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public StatusTask Status { get; set; }
        public Priority Priority { get; set; }
        public DateTime Deadline { get; set; }
        public string ProjectName { get; set; }
        public string ExecutorName { get; set; }
    }
}

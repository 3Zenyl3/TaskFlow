using TaskFlow.Entities;

namespace TaskFlow.Models.Request
{
    public class CreateTaskRequest
    {
        public string Title {  get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }
        public int? StageId { get; set; }
        public StatusTask Status { get; set; }
        public TaskType Type { get; set; }
        public int ExecutorId { get; set; }
        public Priority Priority { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DeadLine { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }
}

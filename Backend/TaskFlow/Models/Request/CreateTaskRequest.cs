using TaskFlow.Entities;

namespace TaskFlow.Models.Request
{
    public class CreateTaskRequest
    {
        public string Title {  get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }
        public int ExecutorId { get; set; }
        public Priority Priority { get; set; }
        public DateTime DeadLine { get; set; }
    }
}

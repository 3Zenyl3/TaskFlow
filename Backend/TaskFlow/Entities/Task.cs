namespace TaskFlow.Entities
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CreatorId { get; set; }
        public int ExecutorId { get; set; }
        public Priority Priority { get; set; }
        public StatusTask Status { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime CreateAt { get; set; }

    }

    public enum Priority
    {
        Low,
        Medium,
        Hight,
        Critical
    }
    public enum StatusTask
    {
        Todo,
        InProgress,
        Review,
        Done
    }
}

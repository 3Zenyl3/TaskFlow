namespace TaskFlow.Entities
{
    public class Task
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;


        public int ProjectId { get; set; }

        public Project Project { get; set; }


        public int CreatorId { get; set; }

        public User Creator { get; set; }


        public int? ExecutorId { get; set; }

        public User? Executor { get; set; }


        public Priority Priority { get; set; }

        public StatusTask Status { get; set; }

        public DateTime Deadline { get; set; }

        public DateTime CreatedAt { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }

    public enum Priority
    {
        Low,
        Medium,
        High,
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

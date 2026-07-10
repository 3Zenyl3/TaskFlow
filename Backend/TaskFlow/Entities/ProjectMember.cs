namespace TaskFlow.Entities
{
    public class ProjectMember
    {
        public int Id { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public ProjectRole Role { get; set; }
    }

    public enum ProjectRole
    {
        Manager,
        Executor
    }
}

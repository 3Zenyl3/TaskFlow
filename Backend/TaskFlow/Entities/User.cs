namespace TaskFlow.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole UserRole { get; set; } = UserRole.User;
        public DateTime CreatedAt { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public ICollection<ProjectMember> Projects { get; set; } = new List<ProjectMember>();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();

        public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();

        public ICollection<Task> CreatedTasks { get; set; } = new List<Task>();

        public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
    public enum UserRole
    {
        User,
        Admin
    }
}

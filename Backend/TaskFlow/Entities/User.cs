namespace TaskFlow.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Roles Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public ICollection<ProjectMember> Projects { get; set; } = new List<ProjectMember>();
    }

    public enum Roles
    {
        Admin,
        Manager,
        Executor
    }
}

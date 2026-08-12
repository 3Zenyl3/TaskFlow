using TaskFlow.Models.Request;

namespace TaskFlow.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Key { get; set; }
        public string Category { get; set; }
        public ProjectColor Color { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? Deadline { get; set; }
        public List<string> Tags { get; set; } = new List<string>();

        public int OwnerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public StatusProject Status { get; set; }
        public User Owner { get; set; }
        public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }

    public enum StatusProject
    {
        Active,
        Completed,
        Archived
    }
}

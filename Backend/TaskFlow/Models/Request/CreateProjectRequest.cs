using TaskFlow.Entities;

namespace TaskFlow.Models.Request
{
    public class CreateProjectRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public string Key { get; set; }
        public string Category { get; set; }
        public ProjectColor Color { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? Deadline { get; set; }
        public List<string> Tags { get; set; } = new List<string>();

        public List<ProjectMemberRequest> Members { get; set; } = new List<ProjectMemberRequest>();
    }

    public class ProjectMemberRequest
    {
        public string Email { get; set; }
        public ProjectRole Role { get; set; }
    }
}
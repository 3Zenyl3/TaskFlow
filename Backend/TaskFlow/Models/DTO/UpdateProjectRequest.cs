using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class UpdateProjectRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string Icon { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public ProjectColor Color { get; set; } = new();

        public DateTime StartDate { get; set; }
        public DateTime? Deadline { get; set; }

        public List<string> Tags { get; set; } = new();
    }
}
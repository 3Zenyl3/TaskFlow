using System.ComponentModel.DataAnnotations;
using TaskFlow.Entities;

namespace TaskFlow.Models.Request
{
    public class CreateProjectRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }
        public string Icon { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 2)]
        [RegularExpression("^[A-Z0-9]+$")]
        public string Key { get; set; }

        [Required]
        public string Category { get; set; }
        [Required]
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
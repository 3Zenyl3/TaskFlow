using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public StatusProject Status { get; set; }
        public UserDto Owner { get; set; }

        public List<UserDto> Members { get; set; } = new();
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public int TaskInProgressCount { get; set; }
        public int LeftTaskCount { get; set; }
        public int OverdueTaskCount { get; set; }
        public int ProgressPercent { get; set; }
        public List<TaskDto> Tasks { get; set; } = [];
        public int TaskInReviewCount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? Deadline { get; set; }
        public string Category { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public List<ActivityDTO> Activities { get; set; } = new List<ActivityDTO>();
        public ICollection<ProjectFileDTO> Files { get; set; } = [];
    }

    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
    }
}

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
        public int ProgressPercent { get; set; }
    }

    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
    }
}

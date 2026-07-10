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
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
    }
}

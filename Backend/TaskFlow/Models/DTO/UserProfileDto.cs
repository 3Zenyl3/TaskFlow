using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AvatarUrl { get; set; }
    }
}

namespace TaskFlow.Models.DTO
{
    public class ActivityDTO
    {
        public int Id { get; set; }

        public string UserName { get; set; } = "";

        public string? AvatarUrl { get; set; }

        public string Description { get; set; } = "";

        public DateTime CreatedAt { get; set; }
    }
}

namespace TaskFlow.Models.DTO
{
    public class NotificationsDTO
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

namespace TaskFlow.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool isRead {  get; set; }
        public DateTime Created { get; set; }
    }
}

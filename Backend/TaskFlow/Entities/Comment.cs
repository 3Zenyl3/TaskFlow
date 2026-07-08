namespace TaskFlow.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int AuthorId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Task Task { get; set; }
        public User Author { get; set; }
    }
}

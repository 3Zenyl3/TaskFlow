using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public User Author { get; set; }
        public string Text { get; set; }
        public DateTime CreateAt { get; set; }
    }
}

namespace TaskFlow.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public StatusProject Status { get; set; }
        public User Owner { get; set; }
    }

    public enum StatusProject
    {
        Active,
        Completed,
        Archived
    }
}

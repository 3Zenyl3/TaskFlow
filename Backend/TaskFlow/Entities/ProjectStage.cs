namespace TaskFlow.Entities
{
    public class ProjectStage
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Position { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

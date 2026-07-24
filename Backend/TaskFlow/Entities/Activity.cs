namespace TaskFlow.Entities
{
    public class Activity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? ProjectId { get; set; }
        public Project? Project { get; set; }

        public int? TaskId { get; set; }
        public Task? Task { get; set; }

        public ActivityType Type { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
public enum ActivityType
{
    CreatedTask,
    UpdatedTaskStatus,
    AddedComment,
    CompletedTask,
    CreatedProject,
    AddedMember,
    DeletedTask,
    ChangedPriority,
    UploadedFile
}

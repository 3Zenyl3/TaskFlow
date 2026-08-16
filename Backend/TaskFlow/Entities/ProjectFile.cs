namespace TaskFlow.Entities
{
    public class ProjectFile
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public int UploadedById { get; set; }
        public User UploadedBy { get; set; } = null!;

        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;

        public string ContentType { get; set; } = string.Empty;

        public long Size { get; set; }

        public string StoragePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }
    }
}

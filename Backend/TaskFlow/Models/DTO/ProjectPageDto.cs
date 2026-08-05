namespace TaskFlow.Models.DTO
{
    public class ProjectPageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public UserDto Owner { get; set; }
        public List<UserDto> Members { get; set; }
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public int ProgressPercent { get; set; }
    }
}

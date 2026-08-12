using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ProjectColor Color { get; set; }
        public string Icon { get; set; }
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public int ProgressPercent { get; set; }

        public List<UserDto> Members { get; set; } = new();
    }
}

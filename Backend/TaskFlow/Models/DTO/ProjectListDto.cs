using TaskFlow.Entities;

namespace TaskFlow.Models.DTO
{
    public class ProjectListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public StatusProject Status { get; set; }
    }
}

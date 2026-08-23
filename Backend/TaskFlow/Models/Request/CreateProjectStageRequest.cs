using TaskFlow.Entities;

namespace TaskFlow.Models.Request
{
    public class CreateProjectStageRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Icon { get; set; }
        public ProjectColor StageColor { get; set; }
    }
}

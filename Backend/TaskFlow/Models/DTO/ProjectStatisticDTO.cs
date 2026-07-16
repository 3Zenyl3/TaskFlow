namespace TaskFlow.Models.DTO
{
    public class ProjectStatisticDTO
    {
        public int TotalTasks { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Todo { get; set; }
        public int Overdue { get; set; }
        public double Progress { get; set; }
    }
}

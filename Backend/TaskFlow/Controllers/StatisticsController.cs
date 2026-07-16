using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private ApplicationDbContext context;

        public StatisticsController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetProjectStatistics(int projectId)
        {
            var project = await context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                return NotFound();
            }

            var taskCount = await context.Tasks
                .Where(t => t.ProjectId == projectId)
                .CountAsync();
            var completedTaskCount = await context.Tasks
                .Where(t => t.ProjectId == projectId && t.Status == StatusTask.Done)
                .CountAsync();
            var inProgressTaskCount = await context.Tasks
                .Where(t => t.ProjectId == projectId && t.Status == StatusTask.InProgress)
                .CountAsync();
            var todoTaskCount = await context.Tasks
                .Where(t => t.ProjectId == projectId && t.Status == StatusTask.Todo)
                .CountAsync();
            var overdueTaskCount = await context.Tasks
                .Where(t => t.ProjectId == projectId && t.Deadline < DateTime.UtcNow && t.Status != StatusTask.Done)
                .CountAsync();

            var progress = taskCount == 0
                    ? 0
                    : (completedTaskCount * 100.0) / taskCount;

            var statistic = new ProjectStatisticDTO
            {
                InProgress = inProgressTaskCount,
                Todo = todoTaskCount,
                Completed = completedTaskCount,
                Progress = progress,
                Overdue = overdueTaskCount,
                TotalTasks = taskCount
            };
            return Ok(statistic);
        }
    }
}

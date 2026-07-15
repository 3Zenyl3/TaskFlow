using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private ApplicationDbContext context;

        public TasksController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyTasks()
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var tasks = await context.Tasks
                .Where(t => t.ExecutorId == userId)
                .OrderBy(t => t.Deadline)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Deadline = t.Deadline,
                    Status = t.Status,
                    ExecutorName = t.Executor != null ? t.Executor.UserName : null,
                    Priority = t.Priority,
                    ProjectName = t.Project.Name
                })
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpGet("created")]
        public async Task<IActionResult> GetMyCreatedTasks()
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var tasks = await context.Tasks
                .Where(t => t.CreatorId == userId)
                .OrderBy(t => t.Deadline)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Deadline = t.Deadline,
                    Status = t.Status,
                    ExecutorName = t.Executor != null ? t.Executor.UserName : null,
                    Priority = t.Priority,
                    ProjectName = t.Project.Name
                })
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpGet("{taskId}")]
        public async Task<IActionResult> GetTaskById(int taskId)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var tasks = await context.Tasks
                .Where(t => (t.CreatorId == userId || t.ExecutorId == userId) && t.Id == taskId)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Deadline = t.Deadline,
                    Status = t.Status,
                    ExecutorName = t.Executor != null ? t.Executor.UserName : null,
                    Priority = t.Priority,
                    ProjectName = t.Project.Name
                })
                .FirstOrDefaultAsync();

            if (tasks == null)
            {
                return NotFound("Задача не найдена.");
            }

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

            if (project == null)
                return NotFound("Проект не найден.");

            var canCreateTask =
                project.OwnerId == userId ||
                project.Members.Any(m => m.UserId == userId);

            if (!canCreateTask)
                return Forbid();

            var executorExists = await context.Users
                .AnyAsync(u => u.Id == request.ExecutorId);

            if (!executorExists)
                return NotFound("Исполнитель не найден.");

            var executorInProject =
                project.OwnerId == request.ExecutorId ||
                project.Members.Any(m => m.UserId == request.ExecutorId);

            if (!executorInProject)
                return BadRequest("Исполнитель не состоит в проекте.");

            var task = new TaskFlow.Entities.Task
            {
                Title = request.Title,
                Description = request.Description,
                Deadline = request.DeadLine,
                CreatorId = userId,
                ExecutorId = request.ExecutorId,
                CreatedAt = DateTime.UtcNow,
                Priority = request.Priority,
                ProjectId = request.ProjectId,
                Status = StatusTask.Todo
            };
            var notification = new Notification
            {
                UserId = request.ExecutorId,
                Text = $"Вам назначена новая задача \"{task.Title}\".",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };
            context.Tasks.Add(task);
            context.Notifications.Add(notification);
            await context.SaveChangesAsync();
            return Ok(new { id = task.Id, message = "Task created" });
        }

        [HttpPatch("{taskId}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int taskId, UpdateTaskStatusRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var status = request.Status;
            var task = await context.Tasks.FindAsync(taskId);

            if (task == null)
            {
                return NotFound("Задача не найдена.");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == task.ProjectId);
            if (project == null)
                return NotFound("Проект не найден.");

            var hasComments = await context.Comments
                .AnyAsync(c => c.TaskId == taskId);
            if (status == StatusTask.Done && !hasComments)
            {
                return BadRequest("Cannot complete task without comment");
            }

            var canPatchTask =
                project.OwnerId == userId ||
                project.Members.Any(m => m.UserId == userId);
            if (!canPatchTask)
                return Forbid();
            task.Status = status;
            await context.SaveChangesAsync();
            return Ok(new { id = taskId, status = status });
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }
            var task = await context.Tasks.FindAsync(taskId);

            if (task == null)
            {
                return NotFound("Задача не найдена.");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == task.ProjectId);
            if (project == null)
                return NotFound("Проект не найден.");

            var user = await context.Users.FindAsync(userId);

            if (user == null)
            {
                return Unauthorized();
            }

            var canDeleteTask =
                user.UserRole == UserRole.Admin ||
                project.OwnerId == userId ||
                project.Members.Any(m =>
                    m.UserId == userId &&
                    m.ProjectRole == ProjectRole.Manager);
            if (!canDeleteTask)
                return Forbid();

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();
            return Ok(new { message = "Task deleted" });
        }

        private async Task<(IActionResult? Result, int UserId)> GetAuthorizedUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return (Unauthorized(), 0);
            }
            return (null, userId);
        }
    }
}

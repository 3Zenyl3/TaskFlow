using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private ApplicationDbContext context;
        private readonly ITaskService taskService;

        public TasksController(ITaskService taskService, ApplicationDbContext context)
        {
            this.taskService = taskService;
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

            var tasks = await taskService.GetMyTasks(userId);

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

            var tasks = await taskService.GetMyCreatedTasks(userId);
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

            var task = await taskService.GetTaskById(taskId, userId);

            if (task == null)
            {
                return NotFound("Задача не найдена.");
            }

            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var taskId = await taskService.CreateTask(request, userId);
            return Ok(new { id = taskId, message = "Task created" });
        }

        [HttpPatch("{taskId}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int taskId, UpdateTaskStatusRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }

            var status = await taskService.UpdateTaskStatus(taskId, request, userId);
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
            
            await taskService.DeleteTask(taskId, userId);

            return Ok(new { message = "Task deleted" });
        }

        [HttpGet("{taskId}/comments")]
        public async Task<IActionResult> GetCommentById(int taskId)
        {
            var comments = await context.Comments
                .Where(c => c.TaskId == taskId)
                .Select(c => new CommentDTO
                {
                    Id = c.Id,
                    Author = c.Author,
                    Text = c.Text,
                    CreateAt = c.CreatedAt
                })
                .ToListAsync();
            return Ok(comments);
        }
        [HttpPost("{taskId}/comments")]
        public async Task<IActionResult> CreateComment(CreateCommentRequest request, int taskId)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
            {
                return result;
            }
            var taskExists = await context.Tasks.AnyAsync(t => t.Id == taskId);

            if (!taskExists)
            {
                return NotFound("Task not found");
            }

            var comment = new Comment
            {
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                TaskId = taskId,
                Text = request.Text
            };
            context.Comments.Add(comment);
            await context.SaveChangesAsync();
            return Ok(new {id = comment.Id, text = request.Text});
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

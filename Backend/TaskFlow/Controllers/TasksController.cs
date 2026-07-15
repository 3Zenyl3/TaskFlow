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
        private readonly ITaskService taskService;

        public TasksController(ITaskService taskService)
        {
            this.taskService = taskService;
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

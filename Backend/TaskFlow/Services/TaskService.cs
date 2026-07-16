using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class TaskService : ITaskService
    {
        private ApplicationDbContext context;

        public TaskService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<TaskDto>> GetMyTasks(int userId)
        {
            return await context.Tasks
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
        }

        public async Task<List<TaskDto>> GetMyCreatedTasks(int userId)
        {
            return await context.Tasks
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
        }

        public async Task<TaskDto?> GetTaskById(int taskId, int userId)
        {
            return await context.Tasks
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
        }

        public async Task<int> CreateTask(CreateTaskRequest request, int userId)
        {
            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

            if (project == null)
                throw new NotFoundException("Проект не найден");

            var canCreateTask =
                project.OwnerId == userId ||
                project.Members.Any(m => m.UserId == userId);

            if (!canCreateTask)
                throw new ForbiddenException();

            var executorExists = await context.Users
                .AnyAsync(u => u.Id == request.ExecutorId);

            if (!executorExists)
                throw new NotFoundException("Исполнитель не найден.");

            var executorInProject =
                project.OwnerId == request.ExecutorId ||
                project.Members.Any(m => m.UserId == request.ExecutorId);

            if (!executorInProject)
                throw new BadRequestException("Исполнитель не состоит в проекте.");

            var task = new TaskFlow.Entities.Task
            {
                Title = request.Title,
                Description = request.Description,
                Deadline = DateTime.SpecifyKind(
                    request.DeadLine,
                    DateTimeKind.Utc
                ),
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
            return task.Id;
        }

        public async Task<StatusTask> UpdateTaskStatus(int taskId, UpdateTaskStatusRequest request, int userId)
        {
            var status = request.Status;
            var task = await context.Tasks.FindAsync(taskId);

            if (task == null)
            {
                throw new NotFoundException("Задача не найдена.");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == task.ProjectId);
            if (project == null)
                throw new NotFoundException("Проект не найден.");

            var hasComments = await context.Comments
                .AnyAsync(c => c.TaskId == taskId);
            if (status == StatusTask.Done && !hasComments)
            {
                throw new BadRequestException("Cannot complete task without comment");
            }

            var canPatchTask =
                project.OwnerId == userId ||
                project.Members.Any(m => m.UserId == userId);
            if (!canPatchTask)
                throw new ForbiddenException();
            task.Status = status;
            await context.SaveChangesAsync();
            return status;
        }

        public async System.Threading.Tasks.Task DeleteTask(int taskId, int userId)
        {
            var task = await context.Tasks.FindAsync(taskId);

            if (task == null)
            {
                throw new NotFoundException("Задача не найдена.");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == task.ProjectId);
            if (project == null)
                throw new NotFoundException("Проект не найден.");

            var user = await context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new UnauthorizedException();
            }

            var canDeleteTask =
                user.UserRole == UserRole.Admin ||
                project.OwnerId == userId ||
                project.Members.Any(m =>
                    m.UserId == userId &&
                    m.ProjectRole == ProjectRole.Manager);
            if (!canDeleteTask)
                throw new ForbiddenException();

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();
        }
    }
}

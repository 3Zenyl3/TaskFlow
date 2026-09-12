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
        private IActivityService activityService;
        private IProjectPermissionService permissionService;

        public TaskService(ApplicationDbContext context, 
            IActivityService activityService,
            IProjectPermissionService permissionService)
        {
            this.context = context;
            this.activityService = activityService;
            this.permissionService = permissionService;
        }

        public async Task<List<TaskDto>> GetMyTasks(int userId)
        {
            return await context.Tasks
                .Where(t => t.ExecutorId == userId)
                .OrderBy(t => t.Deadline)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    ProjectId = t.ProjectId,
                    Key = $"{t.Project.Key}-{t.Id}",
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Deadline = t.Deadline,
                    ProjectName = t.Project.Name,
                    ExecutorName = t.Executor != null
                            ? t.Executor.UserName
                            : null,
                    StageId = t.StageId,
                    Tags = t.Tags,
                    Comments = t.Comments
                            .Select(c => new CommentDTO
                            {
                                Id = c.Id,
                                Author = new UserDto
                                {
                                    UserId = c.Author.Id,
                                    AvatarUrl = c.Author.AvatarUrl,
                                    UserName = c.Author.UserName
                                },
                                CreateAt = c.CreatedAt,
                                Text = c.Text
                            })
                            .ToList(),
                    Type = t.Type,
                    StartDate = t.StartDate
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
                    ProjectName = t.Project.Name,
                    StageId = t.StageId,
                    StageName = t.Stage.Name
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
                    ProjectName = t.Project.Name,
                    StageId = t.StageId,
                    StageName = t.Stage.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> CreateTask(CreateTaskRequest request, int userId)
        {
            if (!await permissionService.HasPermission(
                userId,
                request.ProjectId,
                ProjectPermission.CreateTask))
            {
                throw new ForbiddenException("Недостаточно прав для создания задачи");
            }

            var project = await context.Projects
                .Include(p => p.Members)
                .Include(p => p.Stages)
                .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

            if (project == null)
                throw new NotFoundException("Проект не найден");


            var executorExists = await context.Users
                .AnyAsync(u => u.Id == request.ExecutorId);

            if (!executorExists)
                throw new NotFoundException("Исполнитель не найден.");

            var executorInProject =
                project.OwnerId == request.ExecutorId ||
                project.Members.Any(m => m.UserId == request.ExecutorId);

            if (!executorInProject)
                throw new BadRequestException("Исполнитель не состоит в проекте.");

            if (request.StageId.HasValue)
            {
                var stageExists = await context.ProjectStages
                    .AnyAsync(s =>
                        s.Id == request.StageId.Value &&
                        s.ProjectId == request.ProjectId);

                if (!stageExists)
                {
                    throw new NotFoundException("Этап не найден");
                }
            }

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
                Status = request.Status,
                StageId = request.StageId,
                Tags = request.Tags,
                Type = request.Type,
                StartDate = request.StartDate,
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
            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.CreatedTask,
                description: $"создал(а) задачу {task.Title}",
                projectId: project.Id,
                taskId: task.Id
            );
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

            if (!await permissionService.HasPermission(
                userId,
                task.ProjectId,
                ProjectPermission.ChangeTaskStatus))
            {
                throw new ForbiddenException("Недостаточно прав для изменения статуса задачи");
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
            task.Status = status;
            await context.SaveChangesAsync();
            var description = status == StatusTask.Done ?
                $"завершил(а) задачу {task.Title}" :
                $"изменил(а) статус задачи {task.Title} на {status}";

            var activityType = status == StatusTask.Done ?
                ActivityType.CompletedTask :
                ActivityType.UpdatedTaskStatus;
            await activityService.CreateActivity(
                userId: userId,
                activityType: activityType,
                description: description,
                projectId: project.Id,
                taskId: task.Id
            );
            return status;
        }

        public async Task<ProjectStageDto> UpdateTaskStage(int taskId, UpdateTaskStageRequest request, int userId)
        {
            var task = await context.Tasks
                .Where(t => t.Id == taskId)
                .FirstOrDefaultAsync();

            if (task == null)
                throw new NotFoundException("Task not found");

            if (!await permissionService.HasPermission(
                userId,
                task.ProjectId,
                ProjectPermission.ChangeTaskStatus))
            {
                throw new ForbiddenException("Недостаточно прав для изменения этапа задачи");
            }

            var userInProject = await context.Projects
                .AnyAsync(p => p.Id == task.ProjectId && (p.OwnerId == userId ||
                    p.Members.Any(m => m.UserId == userId)
                ));

            if (!userInProject)
                throw new ForbiddenException("User not in project");

            var stage = await context.ProjectStages
                .Where(s => s.Id == request.StageId)
                .FirstOrDefaultAsync();
            if (stage == null)
                throw new NotFoundException("Stage not found");

            if (stage.ProjectId != task.ProjectId)
                throw new BadRequestException("Stage not found in project");

            task.StageId = stage.Id;
            await context.SaveChangesAsync();

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.ChangedTaskStage,
                description: $"переместил(а) задачу {task.Title} в этап {stage.Name}",
                projectId: task.ProjectId,
                taskId: task.Id
            );

            return new ProjectStageDto
            {
                Id = stage.Id,
                ProjectId = stage.ProjectId,
                Name = stage.Name,
                Description = stage.Description,
                Icon = stage.Icon,
                ColorStage = stage.ColorStage,
                Position = stage.Position,
                CompletedTasks = await context.Tasks
                    .CountAsync(t => t.StageId == stage.Id &&
                                     t.Status == StatusTask.Done),
                TotalTasks = await context.Tasks
                    .CountAsync(t => t.StageId == stage.Id),
                StartDate = stage.StartDate,
                EndDate = stage.EndDate
            };
        }

        public async System.Threading.Tasks.Task DeleteTask(int taskId, int userId)
        {
            var task = await context.Tasks.FindAsync(taskId);

            if (task == null)
            {
                throw new NotFoundException("Задача не найдена.");
            }

            if (!await permissionService.HasPermission(
                userId,
                task.ProjectId,
                ProjectPermission.DeleteTask))
            {
                throw new ForbiddenException("Недостаточно прав для удаления задачи");
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


            context.Tasks.Remove(task);

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.DeletedTask,
                description: $"удалил(а) задачу {task.Title}",
                projectId: task.ProjectId,
                taskId: task.Id
            );
            await context.SaveChangesAsync();
        }
    }
}

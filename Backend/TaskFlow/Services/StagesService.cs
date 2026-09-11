using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class StagesService
    {
        private readonly ApplicationDbContext context;
        private readonly IActivityService activityService;

        public StagesService(ApplicationDbContext context, IActivityService activityService)
        {
            this.context = context;
            this.activityService = activityService;
        }

        public async Task<List<ProjectStageDto>> GetStages(int projectId)
        {
            var projectStages = context.ProjectStages
                .AsNoTracking()
                .Where(x => x.ProjectId == projectId)
                .OrderBy(x => x.Position);

            return await projectStages
                .Select(s => new ProjectStageDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Position = s.Position,
                    ProjectId = s.ProjectId,
                    StartDate = s.StartDate,
                    Description = s.Description,
                    ColorStage = s.ColorStage,
                    CompletedTasks = context.Tasks
                        .Where(t => t.StageId == s.Id &&
                            t.ProjectId == projectId &&
                            t.Status == StatusTask.Done)
                        .Count(),
                    TotalTasks = context.Tasks
                        .Where(t => t.StageId == s.Id &&
                            t.ProjectId == projectId)
                        .Count(),
                    EndDate = s.EndDate,
                    Icon = s.Icon
                })
                .ToListAsync();
        }

        public async Task<ProjectStageDto?> GetCurrentStage(int projectId, int stageId)
        {
            var projectStage = context.ProjectStages
                .AsNoTracking()
                .Where(x => x.ProjectId == projectId && x.Id == stageId);

            return await projectStage
                .Select(s => new ProjectStageDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Position = s.Position,
                    ProjectId = s.ProjectId,
                    StartDate = s.StartDate,
                    Description = s.Description,
                    ColorStage = s.ColorStage,
                    CompletedTasks = context.Tasks
                        .Where(t => t.StageId == s.Id &&
                            t.ProjectId == projectId &&
                            t.Status == StatusTask.Done)
                        .Count(),
                    TotalTasks = context.Tasks
                        .Where(t => t.StageId == s.Id &&
                            t.ProjectId == projectId)
                        .Count(),
                    EndDate = s.EndDate,
                    Icon = s.Icon
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProjectStageDto> CreateStage(
            CreateProjectStageRequest request,
            int projectId,
            int userId)
        {
            var maxPosition = await context.ProjectStages
                .Where(s => s.ProjectId == projectId)
                .Select(s => (int?)s.Position)
                .MaxAsync() ?? 0;

            var stage = new ProjectStage
            {
                Name = request.Name,
                Description = request.Description,
                Position = maxPosition + 1,
                ProjectId = projectId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ColorStage = request.StageColor,
                Icon = request.Icon,
            };

            await context.ProjectStages.AddAsync(stage);
            await context.SaveChangesAsync();

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.CreatedStage,
                description: $"создал(а) этап {stage.Name}",
                projectId: projectId,
                taskId: null
            );


            return new ProjectStageDto
            {
                Id = stage.Id,
                Name = stage.Name,
                Description = stage.Description,
                Position = stage.Position,
                ProjectId = stage.ProjectId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ColorStage = request.StageColor,
                Icon = request.Icon,
            };
        }

        public async Task<ProjectStageDto> UpdateStage(
            CreateProjectStageRequest request,
            int projectId,
            int stageId,
            int userId)
        {
            var stage = await context.ProjectStages
                .FirstOrDefaultAsync(s => s.Id == stageId && s.ProjectId == projectId);

            if (stage == null)
            {
                throw new NotFoundException("Этап не найден");
            }

            stage.Name = request.Name;
            stage.Description = request.Description;

            await context.SaveChangesAsync();
            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.UpdatedStage,
                description: $"изменил(а) этап {stage.Name}",
                projectId: projectId,
                taskId: null
            );

            return new ProjectStageDto
            {
                Id = stage.Id,
                Name = stage.Name,
                Description = stage.Description,
                Position = stage.Position,
                ProjectId = stage.ProjectId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ColorStage = request.StageColor,
                Icon = request.Icon,
            };
        }

        public async System.Threading.Tasks.Task DeleteStage(int projectId, int stageId, int userId)
        {
            var stage = await context.ProjectStages
                .FirstOrDefaultAsync(s => s.Id == stageId && s.ProjectId == projectId);

            if (stage == null)
            {
                throw new NotFoundException("Этап не найден");
            }
            var stageName = stage.Name;
            context.ProjectStages.Remove(stage);

            await context.SaveChangesAsync();

            await activityService.CreateActivity(
                userId: userId,
                activityType: ActivityType.DeletedStage,
                description: $"удалил(а) этап {stageName}",
                projectId: projectId,
                taskId: null
            );
        }
    }
}

using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.DTO;

namespace TaskFlow.Services
{
    public class StagesService
    {
        private readonly ApplicationDbContext context;

        public StagesService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<ProjectStageDto>> GetStages(int projectId)
        {
            var projectStages = context.ProjectStages
                .Where(x => x.ProjectId == projectId)
                .OrderBy(x => x.Position);

            return await projectStages
                .Select(s => new ProjectStageDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Position = s.Position,
                    ProjectId = s.ProjectId,
                    CreatedDate = s.CreatedDate,
                    Description = s.Description
                })
                .ToListAsync();
        }

        public async Task<ProjectStageDto> CreateStage(CreateProjectStageRequest request, int projectId)
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
                CreatedDate = DateTime.UtcNow,
            };

            await context.ProjectStages.AddAsync(stage);
            await context.SaveChangesAsync();

            return new ProjectStageDto
            {
                Id = stage.Id,
                Name = stage.Name,
                Description = stage.Description,
                Position = stage.Position,
                ProjectId = stage.ProjectId,
                CreatedDate = stage.CreatedDate
            };
        }

        public async Task<ProjectStageDto> UpdateStage(CreateProjectStageRequest request, int projectId, int stageId)
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

            return new ProjectStageDto
            {
                Id = stage.Id,
                Name = stage.Name,
                Description = stage.Description,
                Position = stage.Position,
                ProjectId = stage.ProjectId,
                CreatedDate = stage.CreatedDate
            };
        }

        public async System.Threading.Tasks.Task DeleteStage(int projectId, int stageId)
        {
            var stage = await context.ProjectStages
                .FirstOrDefaultAsync(s => s.Id == stageId && s.ProjectId == projectId);

            if (stage == null)
            {
                throw new NotFoundException("Этап не найден");
            }

            context.ProjectStages.Remove(stage);

            await context.SaveChangesAsync();
        }
    }
}

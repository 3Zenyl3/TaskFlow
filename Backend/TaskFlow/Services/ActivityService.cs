using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class ActivityService : IActivityService
    {
        private ApplicationDbContext context;

        public ActivityService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<ActivityDTO>> GetTeamActivity(int userId)
        {
            return await context.Activities
                .AsNoTracking()
                .Where(a =>
                    a.ProjectId != null &&
                    (a.Project!.Members.Any(m => m.UserId == userId) ||
                    a.Project.OwnerId == userId)
                    )
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new ActivityDTO
                {
                    Type = a.Type,
                    Id = a.Id,
                    User = new UserDto
                    {
                        AvatarUrl = a.User.AvatarUrl,
                        UserName = a.User.UserName,
                        UserId = a.UserId
                    },
                    Description = a.Description,
                    CreatedAt = a.CreatedAt,
                })
                .Take(10)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task CreateActivity(int userId,
            ActivityType activityType,
            string description,
            int? projectId,
            int? taskId)
        {
            var activity = new Activity
            {
                Description = description,
                UserId = userId,
                ProjectId = projectId,
                TaskId = taskId,
                Type = activityType,
                CreatedAt = DateTime.UtcNow
            };

            await context.Activities.AddAsync(activity);
            await context.SaveChangesAsync();
        }
    }
}

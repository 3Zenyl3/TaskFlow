using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
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
                    a.Project!.Members.Any(m => m.UserId == userId))
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new ActivityDTO
                {
                    User = new UserDto
                    {
                        AvatarUrl = a.User.AvatarUrl,
                        UserName = a.User.UserName,
                        UserId = a.UserId
                    },
                    Description = a.Description,
                    CreatedAt = a.CreatedAt,
                    AvatarUrl = a.User.AvatarUrl
                })
                .Take(10)
                .ToListAsync();
        }
    }
}

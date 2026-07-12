using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;

namespace TaskFlow.Services
{
    public class ProjectService
    {
        private ApplicationDbContext context;

        public ProjectService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<ProjectListDto>> GetAllProject(int userId)
        {
            return await context.ProjectMembers
                .Where(pm => pm.UserId == userId)
                .Select(pm => pm.Project)
                .Select(pm => new ProjectListDto
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Status = pm.Status
                })
                .ToListAsync();
        }

        public async Task<ProjectDetailsDto?> GetCurrentProject(int projectId, int userId)
        {
            return await context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId && pm.UserId == userId)
                .Select(pm => new ProjectDetailsDto
                {
                    Id = pm.Project.Id,
                    Name = pm.Project.Name,
                    Status = pm.Project.Status,
                    Description = pm.Project.Description,
                    Members = pm.Project.Members
                        .Select(m => new UserDto
                        {
                            UserId = m.User.Id,
                            UserName = m.User.UserName,
                            AvatarUrl = m.User.AvatarUrl,
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}

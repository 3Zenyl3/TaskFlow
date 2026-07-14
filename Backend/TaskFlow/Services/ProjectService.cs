using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;

namespace TaskFlow.Services
{
    public class ProjectService
    {
        private ApplicationDbContext context;

        public ProjectService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<ProjectListDto>> GetAllProjectUser(int userId)
        {
            return await context.Projects
                .Where(p =>
                    p.OwnerId == userId ||
                    p.Members.Any(m => m.UserId == userId)
                )
                .Select(pm => new ProjectListDto
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Status = pm.Status,
                    OwnerId = pm.OwnerId
                })
                .ToListAsync();
        }

        public async Task<ProjectDetailsDto?> GetCurrentProject(int projectId, int userId)
        {
            return await context.Projects
                .Where(p => p.Id == projectId && (p.Members.Any(m => m.UserId == userId) || p.OwnerId == userId))
                .Select(p => new ProjectDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status,
                    Description = p.Description,
                    Members = p.Members
                        .Select(m => new UserDto
                        {
                            UserId = m.User.Id,
                            UserName = m.User.UserName,
                            AvatarUrl = m.User.AvatarUrl,
                        })
                        .ToList(),
                    Owner = new UserDto
                    {
                        UserId = p.Owner.Id,
                        UserName = p.Owner.UserName,
                        AvatarUrl = p.Owner.AvatarUrl
                    }
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProjectCreateDto> CreateProject(User user, CreateProjectRequest request)
        {
            if (user.Role == Roles.Admin || user.Role == Roles.Manager)
            {
                var project = new Project
                {
                    CreatedDate = DateTime.UtcNow,
                    Description = request.Description,
                    Name = request.Name,
                    Owner = user,
                    OwnerId = user.Id,
                    Status = StatusProject.Active,
                };
                context.Projects.Add(project);
                await context.SaveChangesAsync();
                return new ProjectCreateDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Status = project.Status
                };
            }
            return null;
        }

        public async Task<UpdateProjectResponse> UpdateProject(UpdateProjectRequest request, int userId, int projectId)
        {
            var project = await context.Projects.FindAsync(projectId);

            if (project == null)
                return new UpdateProjectResponse
                {
                    UpdateProjectResult = ProjectOperationResult.NotFound
                };
            if (project.OwnerId != userId)
                return new UpdateProjectResponse
                {
                    UpdateProjectResult = ProjectOperationResult.Forbidden
                };

            if (project.OwnerId != userId)
                return new UpdateProjectResponse
                {
                    UpdateProjectResult = ProjectOperationResult.Forbidden
                };

            if (request.Name != null)
                project.Name = request.Name;
            if (request.Description != null)
                project.Description = request.Description;
            await context.SaveChangesAsync();
            return new UpdateProjectResponse
            {
                UpdateProjectResult = ProjectOperationResult.Success,
                Project = project
            };
        }

        public async Task<ProjectOperationResult> DeleteProject(int userId, int projectId)
        {
            var project = await context.Projects.FindAsync(projectId);

            if (project == null)
                return ProjectOperationResult.NotFound;
            if (project.OwnerId != userId)
                return ProjectOperationResult.Forbidden;

            context.Projects.Remove(project);
            await context.SaveChangesAsync();
            return ProjectOperationResult.Success;
        }
    }
}

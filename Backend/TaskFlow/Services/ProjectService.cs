using Microsoft.EntityFrameworkCore;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Services
{
    public class ProjectService : IProjectService
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
                .Select(p => new ProjectListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Color = new ProjectColor
                    {
                        Name = p.Color.Name,
                        Value = p.Color.Value,
                        Background = p.Color.Background
                    },
                    Icon = p.Icon,
                    TaskCount = p.Tasks.Count(),
                    CompletedTaskCount = p.Tasks
                        .Count(t => t.Status == StatusTask.Done),
                    ProgressPercent = p.Tasks.Count() == 0
                        ? 0
                        : (int)(p.Tasks.Count(t => t.Status == StatusTask.Done) * 100.0
                            / p.Tasks.Count()),
                    Members = p.Members
                        .Select(m => new UserDto
                        {
                            UserId = m.User.Id,
                            UserName = m.User.UserName,
                            AvatarUrl = m.User.AvatarUrl,
                        })
                        .ToList(),
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
            if (user != null)
            {
                var project = new Project
                {
                    Name = request.Name,
                    Description = request.Description,
                    Icon = request.Icon,
                    Key = request.Key,
                    Category = request.Category,
                    Color = request.Color,
                    StartDate = request.StartDate,
                    Deadline = request.Deadline,
                    Tags = request.Tags,
                    OwnerId = user.Id,
                    CreatedDate = DateTime.UtcNow,
                    Status = StatusProject.Active,
                };
                context.Projects.Add(project);
                await context.SaveChangesAsync();
                foreach (var memberRequest in request.Members)
                {
                    var memberUser = await context.Users
                        .FirstOrDefaultAsync(u => u.Email == memberRequest.Email);

                    if (memberUser == null || memberUser.Id == user.Id)
                        continue;

                    var member = new ProjectMember
                    {
                        ProjectId = project.Id,
                        UserId = memberUser.Id,
                        ProjectRole = memberRequest.Role
                    };

                    context.ProjectMembers.Add(member);
                }

                context.ProjectMembers.Add(new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = user.Id,
                    ProjectRole = ProjectRole.Owner
                });

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

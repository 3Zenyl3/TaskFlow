using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;
using TaskFlow.Models.Request;
using TaskFlow.Services;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private ApplicationDbContext context;
        private ProjectService projectService;

        public ProjectsController(ApplicationDbContext context, ProjectService projectService)
        {
            this.context = context;
            this.projectService = projectService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(CreateProjectRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var user = await context.Users.FindAsync(userId);

            if (user == null)
                return Unauthorized();

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
                return StatusCode(201, new ProjectCreateDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Status = project.Status
                });
            }

            return BadRequest("Роль не позволяет создавать проект");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUserProject()
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var projects = await projectService.GetAllProject(userId);

            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrentIdProject(int id)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;

            var project = await projectService.GetCurrentProject(id, userId);

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var project = await context.Projects.FindAsync(id);

            if (project == null)
                return NotFound();
            if (project.OwnerId != userId)
                return Forbid();

            if (project.OwnerId != userId)
                return Forbid();

            if (request.Name != null)
                project.Name = request.Name;
            if (request.Description != null)
                project.Description = request.Description;
            await context.SaveChangesAsync();
            return Ok(project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var project = await context.Projects.FindAsync(id);

            if (project == null)
                return NotFound();
            if (project.OwnerId != userId)
                return Forbid();

            context.Projects.Remove(project);
            await context.SaveChangesAsync();

            return Ok(new {message = "Project deleted" });
        }

        private async Task<(IActionResult? Result, int UserId)> GetAuthorizedUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return (Unauthorized(), 0);
            }

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return (Unauthorized(), 0);
            }
            return (null, userId);
        }
    }
}

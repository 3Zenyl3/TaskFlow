using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models;
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

            var createProject = await projectService.CreateProject(user, request);

            if (createProject != null)
                return StatusCode(201, createProject);

            return BadRequest("Роль не позволяет создавать проект");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUserProject()
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var projects = await projectService.GetAllProjectUser(userId);

            return Ok(projects);
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetCurrentIdProject(int projectId)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;

            var project = await projectService.GetCurrentProject(projectId, userId);

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, UpdateProjectRequest request)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var updateProjectResponse = await projectService.UpdateProject(request, userId, projectId);
            var status = updateProjectResponse.UpdateProjectResult;

            if (status == ProjectOperationResult.NotFound)
                return NotFound();
            if (status == ProjectOperationResult.Forbidden)
                return Forbid();

            var project = updateProjectResponse.Project;
            return Ok(project);
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var (result, userId) = await GetAuthorizedUserId();
            if (result != null)
                return result;
            var status = await projectService.DeleteProject(projectId, userId);

            if(status == ProjectOperationResult.NotFound)
                return NotFound();
            if(status == ProjectOperationResult.Forbidden)
                return Forbid();

            return Ok(new {message = "Project deleted" });
        }

        private async Task<(IActionResult? Result, int UserId)> GetAuthorizedUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return (Unauthorized(), 0);
            }

            return (null, userId);
        }
    }
}

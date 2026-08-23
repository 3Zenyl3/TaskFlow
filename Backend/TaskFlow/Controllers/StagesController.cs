using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Exceptions;
using TaskFlow.Models.Request;
using TaskFlow.Services;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class StagesController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private StagesService stagesService;
        public StagesController(ApplicationDbContext context, StagesService service)
        {
            this.context = context;
            this.stagesService = service;
        }

        [HttpGet("{projectId}/stages")]
        public async Task<IActionResult> GetStages(int projectId)
        {
            var (result, userId) = await GetAuthorizedUserId();

            if(result != null)
            {
                return result;
            }

            var thisUserInProject = await IsUserInProject(projectId, userId);

            if (!thisUserInProject)
            {
                throw new ForbiddenException();
            }

            return Ok(await stagesService.GetStages(projectId));
        }

        [HttpPost("{projectId}/stages")]
        public async Task<IActionResult> CreateStage(CreateProjectStageRequest request, int projectId)
        {
            var (result, userId) = await GetAuthorizedUserId();

            if (result != null)
            {
                return result;
            }

            var thisUserInProject = await IsUserInProject(projectId, userId);

            if (!thisUserInProject)
            {
                throw new ForbiddenException();
            }

            return Ok(await stagesService.CreateStage(request, projectId));
        }

        [HttpPut("{projectId}/{stageId}")]
        public async Task<IActionResult> UpdateStage(CreateProjectStageRequest request, int projectId, int stageId)
        {
            var (result, userId) = await GetAuthorizedUserId();

            if (result != null)
            {
                return result;
            }

            var thisUserInProject = await IsUserInProject(projectId, userId);

            if (!thisUserInProject)
            {
                throw new ForbiddenException();
            }

            return Ok(await stagesService.UpdateStage(request, projectId, stageId));
        }

        [HttpDelete("{projectId}/{stageId}")]
        public async Task<IActionResult> DeleteStage(int projectId, int stageId)
        {
            var (result, userId) = await GetAuthorizedUserId();

            if (result != null)
            {
                return result;
            }

            var thisUserInProject = await IsUserInProject(projectId, userId);

            if (!thisUserInProject)
            {
                throw new ForbiddenException();
            }

            await stagesService.DeleteStage(projectId, stageId);

            return Ok();
        }

        private async Task<bool> IsUserInProject(int projectId, int userId)
        {
            return await context.Projects
                .AnyAsync(p => p.Id == projectId && (
                    p.OwnerId == userId ||
                    p.Members.Any(m => m.UserId == userId)
                ));
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

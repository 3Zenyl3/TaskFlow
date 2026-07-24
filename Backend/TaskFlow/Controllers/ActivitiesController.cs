using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Models.DTO;
using TaskFlow.Services;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private ActivityService activityService;

        public ActivitiesController(ActivityService activityService)
        {
            this.activityService = activityService;
        }

        [HttpGet("team")]
        public async Task<IActionResult> GetTeamActivity()
        {
            var (result, userId) = await GetAuthorizedUserId();

            if(result != null)
            {
                return result;
            }

            var activity = await activityService.GetTeamActivity(userId);
            return Ok(activity);
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

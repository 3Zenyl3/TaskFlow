using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models.DTO;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController :ControllerBase
    {
        private ApplicationDbContext context;

        public NotificationsController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var (result, userId) = await GetAuthorizedUserId();
            if(result != null)
            {
                return result;
            }

            var notifications = await context.Notifications
                .Where(n => n.UserId == userId)
                .Select(n => new NotificationsDTO
                {
                    Text = n.Text,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead,
                    Id = n.Id
                })
                .ToListAsync();
            return Ok(notifications);
        }

        [HttpPatch("{notId}/read")]
        public async Task<IActionResult> ReadNotifications(int notId)
        {
            var (result, userId) = await GetAuthorizedUserId();

            if (result != null)
            {
                return result;
            }

            var not = await context.Notifications
                .FirstOrDefaultAsync(n =>
                    n.Id == notId &&
                    n.UserId == userId);

            if (not == null)
            {
                return NotFound();
            }

            not.IsRead = true;

            await context.SaveChangesAsync();

            return Ok(new { message = "Notification read" });
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

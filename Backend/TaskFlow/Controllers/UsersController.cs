using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Net;
using System.Security.Claims;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Models;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private ApplicationDbContext context;

        public UsersController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if(userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }
            var user = await context.Users
                .Where(x => x.Id == userId)
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                AvatarUrl = user.AvatarUrl
            });
        }

        [HttpPatch("profile")]
        public async Task<IActionResult> PatchProfile(PatchProfileRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }
            var user = await context.Users
                .Where(x => x.Id == userId)
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }
            user.AvatarUrl = request.AvatarUrl;
            user.UserName = request.UserName;
            await context.SaveChangesAsync();
            return Ok(new { message = "Profile updated" });
        }
    }
}

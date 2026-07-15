using Microsoft.AspNetCore.Mvc;
using TaskFlow.Models.Request;
using TaskFlow.Services;
using TaskFlow.Services.Interfaces;

namespace TaskFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var userName = request.UserName;
            var password = request.Password;
            var email = request.Email;
            if(email == null)
            {
                return BadRequest("Нет email");
            }
            var result = await authService.RegisterUser(userName, password, email);
            if (result)
            {
                return Ok(new { message = "User register" });
            }
            return Conflict(new { message = "Email уже существует" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var email = request.Email.ToLower().Trim();
            var password = request.Password;
            var userInBd = await authService.Login(email, password);
            var token = authService.GenerateJwtToken(userInBd);
            return Ok(new { token = token });
        }
    }
}

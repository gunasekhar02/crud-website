using Microsoft.AspNetCore.Mvc;
using CrudApi.Data;
using CrudApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { success = false, message = "Username and password are required." });
            }

            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            {
                return Conflict(new { success = false, message = "Username already exists." });
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok(new { success = true, userId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }

            return Ok(new { success = true, username = user.Username, userId = user.Id });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { success = true });
        }

        public record LoginRequest(string Username, string Password);
    }
}

using Microsoft.AspNetCore.Mvc;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Authentication.Services;
using Authentication.ModeDTOs;
using System.Security.Claims;

namespace Authentication.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class AuthController(
        ILogger<AuthController> logger,
        JwtService jwtService,
        IRepository<User> userRepository,
        IRepository<UserRole> userRoleRepository)
        : ControllerBase
    {
        /// <summary>
        /// CTRL + M + P - expand all
        /// CTRL + M + O - collapse all
        /// </summary>

        #region repos init
        private readonly ILogger<AuthController> _logger = logger;
        private readonly JwtService _jwtService = jwtService;
        private readonly IRepository<User> _userRepository = userRepository;
        private readonly IRepository<UserRole> _userRoleRepository = userRoleRepository;
        #endregion

        [AllowAnonymous]
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto dto)
        {
            var user = await _userRepository.GetAll()
                .FirstOrDefaultAsync(u => u.Email.Equals(dto.Email) && u.Password.Equals(dto.Password));

            if (user == null)
            {
                _logger.LogError("AuthController. Wrong credentials.");
                return Unauthorized("Wrong credentials.");
            }

            var role = (await _userRoleRepository.GetById(user.FkUserRoles))?.Name ?? "User";
            var token = _jwtService.GenerateToken(user.Email, role);

            _logger.LogInformation("AuthController. Token has been generated.");
            return CreatedAtAction(nameof(Login), new { token });
        }

        [Authorize]
        [HttpGet("Me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetCurrentUser()
        {
            var email = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new { email, role });
        }

    }
}
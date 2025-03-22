using Microsoft.AspNetCore.Mvc;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Authentication.Services;
using Authentication.ModeDTOs;

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

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userRepository.GetAll()
                .FirstOrDefaultAsync(u => u.Login == dto.Login && u.Password == dto.Password);

            if (user == null)
            {
                _logger.LogError("AuthController. Wrong credentials.");
                return Unauthorized("Wrong credentials.");
            }

            var role = (await _userRoleRepository.GetById(user.FkUserRoles))?.Name ?? "User";
            var token = _jwtService.GenerateToken(user.Login, role);

            _logger.LogInformation("AuthController. Token has been generated.");
            return Ok(new { token });
        }

    }
}
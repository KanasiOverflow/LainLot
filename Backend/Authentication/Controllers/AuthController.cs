using System.Security.Claims;
using Authentication.DTOs;
using Authentication.ModeDTOs;
using Authentication.Services;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Authentication.Controllers
{
    [ApiController]
    [Authorize(Roles = "Registered User")]
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

        #region Login page
        [AllowAnonymous]
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> Login(LoginInfo entity)
        {
            if (entity == null)
                return BadRequest();

            var user = await _userRepository.GetAll()
                .FirstOrDefaultAsync(u => u.Email.Equals(entity.Email) && u.Password.Equals(entity.Password));

            _logger.LogInformation($"Trying login for: {entity.Email}");
            _logger.LogInformation($"Login attempt: {entity.Email} | {entity.Password}");

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
        #endregion

        #region Profile page
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
        #endregion

        #region Registration page
        [AllowAnonymous]
        [HttpPost("Registration")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> Registration(Registration entity)
        {
            if (entity == null)
                return BadRequest();

            var user = new User
            {
                Email = entity.Email,
                Login = entity.Login,
                Password = entity.Password
            };

            var userRole = _userRoleRepository.GetAll()
                .Where(x => x.Name.ToLower().Equals("registered user"))
                .FirstOrDefault();

            if (userRole != null)
                user.FkUserRoles = userRole.Id;

            // Logic for email confirmation here
            user.ConfirmEmail = 0;
            user.Hash = string.Empty;

            try
            {
                await _userRepository.Add(user);
                return CreatedAtAction(nameof(Registration), entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }
        #endregion
    }
}
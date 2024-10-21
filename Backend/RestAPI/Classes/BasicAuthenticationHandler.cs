using System.Text;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using RestAPI.Enums;
using Microsoft.EntityFrameworkCore;

namespace RestAPI.Classes
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly string _webSiteName;
        private readonly string _invalidAuthorizationHeader;

        private readonly IRepository<User> _userRepository;
        private readonly IRepository<UserRole> _userRoleRepository;

        [Obsolete]
        public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IRepository<User> userRepository,
        IRepository<UserRole> userRoleRepository
        ) : base(options, logger, encoder, clock)
        {
            _webSiteName = "LainLot.com";
            _invalidAuthorizationHeader = "Invalid Authorization Header.";

            _userRepository = userRepository;
            _userRoleRepository = userRoleRepository;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                Response.Headers.WWWAuthenticate = "Basic";
                return AuthenticateResult.Fail("No contains header");
            }

            var authHeader = Request.Headers.Authorization.ToString();
            if (authHeader != null && authHeader.StartsWith("basic", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader["Basic ".Length..].Trim();
                var credentialstring = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var credentials = credentialstring.Split(':');

                // Check user credentials from database
                var user = await _userRepository.GetAll()
                    .FirstOrDefaultAsync(x => x.Login == credentials[0] && x.Password == credentials[1]);

                if (user != null)
                {
                    var accessLevel = await _userRoleRepository.GetById(user.FkUserRoles);

                    if (!string.IsNullOrEmpty(accessLevel?.Name) && accessLevel.Name == AccessLevels.Admin.ToString())
                    {
                        var claims = new[] { new Claim("login", user.Login), new Claim(ClaimTypes.Role, accessLevel.Name) };
                        var identity = new ClaimsIdentity(claims, "Basic");
                        var claimsPrincipal = new ClaimsPrincipal(identity);
                        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
                    }
                }
            }

            Response.StatusCode = 401;
            Response.Headers.Append(_webSiteName, _invalidAuthorizationHeader);
            return AuthenticateResult.Fail(_invalidAuthorizationHeader);
        }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RestAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class CredentialsChecker : ControllerBase
    {
        [HttpGet("CheckCredentials")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public string CheckCredentials()
        {
            return "Connected!";
        }
    }
}
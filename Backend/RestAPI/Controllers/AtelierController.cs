using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Models;
using RestAPI.AutoMapper;
using DB = DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace RestAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class AtelierController(
        ILogger<DatabaseController> logger,
        IRepository<DB.About> aboutRepository,
        IRepository<DB.Language> languageRepository) 
        : ControllerBase
    {
        /// <summary>
        /// CTRL + M + P - expand all
        /// CTRL + M + O - collapse all
        /// </summary>

        private readonly Mapper _mapper = MapperConfig.InitializeAutomapper();
        #region repos init
        private readonly ILogger<DatabaseController> _logger = logger;
        private readonly IRepository<DB.About> _aboutRepository = aboutRepository;
        private readonly IRepository<DB.Language> _languageRepository = languageRepository;
        #endregion

        #region Languages

        [AllowAnonymous]
        [HttpGet("GetLanguageIdByAbbreviation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<int> GetLanguageIdByAbbreviation(string abbreviation)
        {
            var dbEntity = _languageRepository.GetAll()
                .FirstOrDefault(x => string.Equals(x.Abbreviation.ToLower(), abbreviation.ToLower()));
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : dbEntity.Id;
        }

        #endregion
    }
}
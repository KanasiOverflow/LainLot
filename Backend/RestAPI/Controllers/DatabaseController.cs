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
    public class DatabaseController : ControllerBase
    {
        /// <summary>
        /// CTRL + M + P - expand all
        /// CTRL + M + O - collapse all
        /// </summary>

        private readonly Mapper _mapper;
        private readonly ILogger<DatabaseController> _logger;
        private readonly IRepository<DB.About> _aboutRepository;
        private readonly IRepository<DB.AccessLevel> _accessLevelRepository;
        private readonly IRepository<DB.Contact> _contactRepository;
        private readonly IRepository<DB.Language> _languageRepository;
        private readonly IRepository<DB.Post> _postRepository;
        private readonly IRepository<DB.PostsTranslation> _postsTranslationRepository;
        private readonly IRepository<DB.User> _userRepository;
        private readonly IRepository<DB.UserProfile> _userProfileRepository;
        private readonly IRepository<DB.UserRole> _userRoleRepository;

        public DatabaseController(
            ILogger<DatabaseController> logger,
            IRepository<DB.About> aboutRepository,
            IRepository<DB.AccessLevel> accessLevelRepository,
            IRepository<DB.Contact> contactRepository,
            IRepository<DB.Language> languageRepository,
            IRepository<DB.Post> postRepository,
            IRepository<DB.PostsTranslation> postsTranslationRepository,
            IRepository<DB.User> userRepository,
            IRepository<DB.UserProfile> userProfileRepository,
            IRepository<DB.UserRole> userRoleRepository)
        {
            _mapper = MapperConfig.InitializeAutomapper();
            _logger = logger;

            _aboutRepository = aboutRepository;
            _accessLevelRepository = accessLevelRepository;
            _contactRepository = contactRepository;
            _languageRepository = languageRepository;
            _postRepository = postRepository;
            _postsTranslationRepository = postsTranslationRepository;
            _userRepository = userRepository;
            _userProfileRepository = userProfileRepository;
            _userRoleRepository = userRoleRepository;
        }

        #region About table

        [HttpGet("GetAboutCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetAboutCount()
        {
            return _aboutRepository.GetAll().Count();
        }

        [HttpGet("GetAboutFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetAboutFields()
        {
            return new About().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetAbout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<About>> GetAbout(int limit, int page)
        {
            var dbList = _aboutRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.About>, List<About>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetAboutById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<About?> GetAboutById(int id)
        {
            var dbEntity = _aboutRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.About, About>(dbEntity);
        }

        [HttpPost("CreateAbout")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<About> CreateAbout(About entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _aboutRepository.Add(_mapper.Map<About, DB.About>(entity));
                return CreatedAtAction(nameof(CreateAbout), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateAbout")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<About> UpdateAbout(About entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _aboutRepository.Update(_mapper.Map<About, DB.About>(entity));
                return CreatedAtAction(nameof(UpdateAbout), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteAbout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteAbout(int id)
        {
            var entity = _aboutRepository.GetById(id);

            if (entity != null)
            {
                _aboutRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region AccessLevels table

        [HttpGet("GetAccessLevelsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetAccessLevelsCount()
        {
            return _accessLevelRepository.GetAll().Count();
        }

        [HttpGet("GetAccessLevelsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetAccessLevelsFields()
        {
            return new AccessLevel().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetAccessLevels")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<AccessLevel>> GetAccessLevels(int limit, int page)
        {
            var dbList = _accessLevelRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.AccessLevel>, List<AccessLevel>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetAccessLevelById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<AccessLevel?> GetAccessLevelById(int id)
        {
            var dbEntity = _accessLevelRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.AccessLevel, AccessLevel>(dbEntity);
        }

        [HttpPost("CreateAccessLevel")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccessLevel> CreateAccessLevel(AccessLevel entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _accessLevelRepository.Add(_mapper.Map<AccessLevel, DB.AccessLevel>(entity));
                return CreatedAtAction(nameof(CreateAccessLevel), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateAccessLevel")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccessLevel> UpdateAccessLevel(AccessLevel entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _accessLevelRepository.Update(_mapper.Map<AccessLevel, DB.AccessLevel>(entity));
                return CreatedAtAction(nameof(UpdateAccessLevel), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteAccessLevel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteAccessLevel(int id)
        {
            var entity = _accessLevelRepository.GetById(id);

            if (entity != null)
            {
                _accessLevelRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Contacts table

        [HttpGet("GetContactsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetContactsCount()
        {
            return _contactRepository.GetAll().Count();
        }

        [HttpGet("GetContactsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetContactsFields()
        {
            return new Contact().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetContacts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Contact>> GetContacts(int limit, int page)
        {
            var dbList = _contactRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Contact>, List<Contact>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetContactById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Contact?> GetContactById(int id)
        {
            var dbEntity = _contactRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Contact, Contact>(dbEntity);
        }

        [HttpPost("CreateContact")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Contact> CreateContact(Contact entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _contactRepository.Add(_mapper.Map<Contact, DB.Contact>(entity));
                return CreatedAtAction(nameof(CreateContact), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateContact")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Contact> UpdateContact(Contact entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _contactRepository.Update(_mapper.Map<Contact, DB.Contact>(entity));
                return CreatedAtAction(nameof(UpdateContact), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteContact")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteContact(int id)
        {
            var entity = _contactRepository.GetById(id);

            if (entity != null)
            {
                _contactRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Languages table

        [HttpGet("GetLanguagesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetLanguagesCount()
        {
            return _languageRepository.GetAll().Count();
        }

        [HttpGet("GetLanguagesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetLanguagesFields()
        {
            return new Language().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetLanguages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Language>> GetLanguages(int limit, int page)
        {
            var dbList = _languageRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Language>, List<Language>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetLanguagesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Language?> GetLanguageById(int id)
        {
            var dbEntity = _languageRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Language, Language>(dbEntity);
        }

        [HttpPost("CreateLanguage")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> CreateLanguage(Language entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _languageRepository.Add(_mapper.Map<Language, DB.Language>(entity));
                return CreatedAtAction(nameof(CreateLanguage), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateLanguage")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> UpdateLanguage(Language entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _languageRepository.Update(_mapper.Map<Language, DB.Language>(entity));                
                return CreatedAtAction(nameof(UpdateLanguage), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteLanguage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteLanguage(int id)
        {
            var entity = _languageRepository.GetById(id);

            if (entity != null)
            {
                _languageRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Posts table

        [HttpGet("GetPostsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetPostsCount()
        {
            return _postRepository.GetAll().Count();
        }

        [HttpGet("GetPostsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetPostsFields()
        {
            return new Post().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetPosts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Post>> GetPosts(int limit, int page)
        {
            var dbList = _postRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Post>, List<Post>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetPostById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Post?> GetPostById(int id)
        {
            var dbEntity = _postRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Post, Post>(dbEntity);
        }

        [HttpPost("CreatePost")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Post> CreatePost(Post entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _postRepository.Add(_mapper.Map<Post, DB.Post>(entity));
                return CreatedAtAction(nameof(CreatePost), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdatePost")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Post> UpdatePost(Post entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _postRepository.Update(_mapper.Map<Post, DB.Post>(entity));
                return CreatedAtAction(nameof(UpdatePost), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeletePost")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeletePost(int id)
        {
            var entity = _postRepository.GetById(id);

            if (entity != null)
            {
                _postRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region PostsTranslations table

        [HttpGet("GetPostsTranslationsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetPostsTranslationsCount()
        {
            return _postsTranslationRepository.GetAll().Count();
        }

        [HttpGet("GetPostsTranslationsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetPostsTranslationsFields()
        {
            return new PostsTranslation().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetPostsTranslations")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<PostsTranslation>> GetPostsTranslations(int limit, int page)
        {
            var dbList = _postsTranslationRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.PostsTranslation>, List<PostsTranslation>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetPostsTranslationById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<PostsTranslation?> GetPostsTranslationById(int id)
        {
            var dbEntity = _postsTranslationRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.PostsTranslation, PostsTranslation>(dbEntity);
        }

        [HttpPost("CreatePostsTranslation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<PostsTranslation> CreatePostsTranslation(PostsTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _postsTranslationRepository.Add(_mapper.Map<PostsTranslation, DB.PostsTranslation>(entity));
                return CreatedAtAction(nameof(CreatePostsTranslation), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdatePostsTranslation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<PostsTranslation> UpdatePostsTranslation(PostsTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _postsTranslationRepository.Update(_mapper.Map<PostsTranslation, DB.PostsTranslation>(entity));
                return CreatedAtAction(nameof(UpdatePostsTranslation), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeletePostsTranslation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeletePostsTranslation(int id)
        {
            var entity = _postsTranslationRepository.GetById(id);

            if (entity != null)
            {
                _postsTranslationRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Users table

        [HttpGet("GetUsersCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetUsersCount()
        {
            return _userRepository.GetAll().Count();
        }

        [HttpGet("GetUsersFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetUsersFields()
        {
            return new User().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetUsers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<User>> GetUsers(int limit, int page)
        {
            var dbList = _userRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.User>, List<User>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetUserById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<User?> GetUserById(int id)
        {
            var dbEntity = _userRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.User, User>(dbEntity);
        }

        [HttpPost("CreateUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<User> CreateUser(User entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRepository.Add(_mapper.Map<User, DB.User>(entity));
                return CreatedAtAction(nameof(CreateUser), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<User> UpdateUser(User entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRepository.Update(_mapper.Map<User, DB.User>(entity));
                return CreatedAtAction(nameof(UpdateUser), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteUser(int id)
        {
            var entity = _userRepository.GetById(id);

            if (entity != null)
            {
                _userRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region UserProfiles table

        [HttpGet("GetUserProfilesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetUserProfilesCount()
        {
            return _userProfileRepository.GetAll().Count();
        }

        [HttpGet("GetUserProfilesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetUserProfilesFields()
        {
            return new UserProfile().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetUserProfiles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<UserProfile>> GetUserProfiles(int limit, int page)
        {
            var dbList = _userProfileRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.UserProfile>, List<UserProfile>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetUserProfilesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserProfile?> GetUserProfileById(int id)
        {
            var dbEntity = _userProfileRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.UserProfile, UserProfile>(dbEntity);
        }

        [HttpPost("CreateUserProfiles")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserProfile> CreateUserProfile(UserProfile entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userProfileRepository.Add(_mapper.Map<UserProfile, DB.UserProfile>(entity));
                return CreatedAtAction(nameof(CreateUserProfile), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUserProfile")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserProfile> UpdateUserProfile(UserProfile entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userProfileRepository.Update(_mapper.Map<UserProfile, DB.UserProfile>(entity));
                return CreatedAtAction(nameof(UpdateUserProfile), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUserProfile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteUserProfile(int id)
        {
            var entity = _userProfileRepository.GetById(id);

            if (entity != null)
            {
                _userProfileRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region UserRoles table

        [HttpGet("GetUserRolesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetUserRolesCount()
        {
            return _userRoleRepository.GetAll().Count();
        }

        [HttpGet("GetUserRolesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetUserRolesFields()
        {
            return new UserRole().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetUserRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<UserRole>> GetUserRoles(int limit, int page)
        {
            var dbList = _userRoleRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.UserRole>, List<UserRole>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetUserRoleById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserRole?> GetUserRoleById(int id)
        {
            var dbEntity = _userRoleRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.UserRole, UserRole>(dbEntity);
        }

        [HttpPost("CreateUserRole")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserRole> CreateUserRole(UserRole entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRoleRepository.Add(_mapper.Map<UserRole, DB.UserRole>(entity));
                return CreatedAtAction(nameof(CreateUserRole), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUserRole")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserRole> UpdateUserRole(UserRole entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRoleRepository.Update(_mapper.Map<UserRole, DB.UserRole>(entity));
                return CreatedAtAction(nameof(UpdateUserRole), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUserRole")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteUserRole(int id)
        {
            var entity = _userRoleRepository.GetById(id);

            if (entity != null)
            {
                _userRoleRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Get Foreign Keys

        [HttpGet("GetFkAccessLevelsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkAccessLevelsData(int id)
        {
            var dbEntity = _accessLevelRepository.GetById(id);
            return dbEntity == null 
                ? string.Empty 
                : $"Level: {dbEntity?.Level} | Description: {dbEntity?.Description}";
        }

        [HttpGet("GetFkLanguagesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkLanguagesData(int id)
        {
            var dbEntity = _languageRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Abbreviation: {dbEntity?.Abbreviation} | FullName: {dbEntity?.FullName}";
        }

        [HttpGet("GetFkPosts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkPosts(int id)
        {
            var dbEntity = _postRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Name: {dbEntity?.Name} | Description: {dbEntity?.Description}";
        }

        [HttpGet("GetFkUsersData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkUsersData(int id)
        {
            var dbEntity = _userRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Login: {dbEntity?.Login} | Email: {dbEntity?.Email}";
        }

        [HttpGet("GetFkUserRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkUserRoles(int id)
        {
            var dbEntity = _userRoleRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Name: {dbEntity?.Name}";
        }

        #endregion
    }
}
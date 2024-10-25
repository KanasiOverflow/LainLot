using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Models;
using RestAPI.AutoMapper;
using DB = DatabaseProvider.Models;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;

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
        private readonly IRepository<DB.Cart> _cartRepository;
        private readonly IRepository<DB.Category> _categoryRepository;
        private readonly IRepository<DB.CategoryHierarchy> _categoryHierarchyRepository;
        private readonly IRepository<DB.Color> _colorRepository;
        private readonly IRepository<DB.Contact> _contactRepository;
        private readonly IRepository<DB.CustomizableProduct> _customizableProductRepository;
        private readonly IRepository<DB.CustomizationOrder> _customizationOrderRepository;
        private readonly IRepository<DB.FabricType> _fabricTypeRepository;
        private readonly IRepository<DB.Language> _languageRepository;
        private readonly IRepository<DB.Order> _orderRepository;
        private readonly IRepository<DB.OrderHistory> _orderHistoryRepository;
        private readonly IRepository<DB.OrderStatus> _orderStatusRepository;
        private readonly IRepository<DB.Payment> _paymentRepository;
        private readonly IRepository<DB.Product> _productRepository;
        private readonly IRepository<DB.ProductImage> _productImageRepository;
        private readonly IRepository<DB.ProductTranslation> _productTranslationRepository;
        private readonly IRepository<DB.Review> _reviewRepository;
        private readonly IRepository<DB.User> _userRepository;
        private readonly IRepository<DB.UserProfile> _userProfileRepository;
        private readonly IRepository<DB.UserRole> _userRoleRepository;

        public DatabaseController(
            ILogger<DatabaseController> logger,
            IRepository<DB.About> aboutRepository,
            IRepository<DB.AccessLevel> accessLevelRepository,
            IRepository<DB.Cart> cartRepository,
            IRepository<DB.Category> categoryRepository,
            IRepository<DB.CategoryHierarchy> categoryHierarchyRepository,
            IRepository<DB.Color> colorRepository,
            IRepository<DB.Contact> contactRepository,
            IRepository<DB.CustomizableProduct> customizableProductRepository,
            IRepository<DB.CustomizationOrder> customizationOrderRepository,
            IRepository<DB.FabricType> fabricTypeRepository,
            IRepository<DB.Language> languageRepository,
            IRepository<DB.Order> orderRepository,
            IRepository<DB.OrderHistory> orderHistoryRepository,
            IRepository<DB.OrderStatus> orderStatusRepository,
            IRepository<DB.Payment> paymentRepository,
            IRepository<DB.Product> productRepository,
            IRepository<DB.ProductImage> productImageRepository,
            IRepository<DB.ProductTranslation> productTranslationRepository,
            IRepository<DB.Review> reviewRepository,
            IRepository<DB.User> userRepository,
            IRepository<DB.UserProfile> userProfileRepository,
            IRepository<DB.UserRole> userRoleRepository)
        {
            _mapper = MapperConfig.InitializeAutomapper();
            _logger = logger;

            _aboutRepository = aboutRepository;
            _accessLevelRepository = accessLevelRepository;
            _cartRepository = cartRepository;
            _categoryRepository = categoryRepository;
            _categoryHierarchyRepository = categoryHierarchyRepository;
            _colorRepository = colorRepository;
            _contactRepository = contactRepository;
            _customizableProductRepository = customizableProductRepository;
            _customizationOrderRepository = customizationOrderRepository;
            _fabricTypeRepository = fabricTypeRepository;
            _languageRepository = languageRepository;
            _orderRepository = orderRepository;
            _orderHistoryRepository = orderHistoryRepository;
            _orderStatusRepository = orderStatusRepository;
            _paymentRepository = paymentRepository;
            _productRepository = productRepository;
            _productImageRepository = productImageRepository;
            _productTranslationRepository = productTranslationRepository;
            _reviewRepository = reviewRepository;
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
        public async Task<ActionResult<About?>> GetAboutById(int id)
        {
            var dbEntity = await _aboutRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return _mapper.Map<DB.About, About>(dbEntity);
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
        public async Task<ActionResult> DeleteAbout(int id)
        {
            var entity = await _aboutRepository.GetById(id);

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

        [HttpGet("GetAccessLevelsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AccessLevel?>> GetAccessLevelsById(int id)
        {
            var dbEntity = await _accessLevelRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.AccessLevel, AccessLevel>(dbEntity);
        }

        [HttpPost("CreateAccessLevels")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccessLevel> CreateAccessLevels(AccessLevel entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _accessLevelRepository.Add(_mapper.Map<AccessLevel, DB.AccessLevel>(entity));
                return CreatedAtAction(nameof(CreateAccessLevels), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateAccessLevels")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<AccessLevel> UpdateAccessLevels(AccessLevel entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _accessLevelRepository.Update(_mapper.Map<AccessLevel, DB.AccessLevel>(entity));
                return CreatedAtAction(nameof(UpdateAccessLevels), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteAccessLevels")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteAccessLevels(int id)
        {
            var entity = await _accessLevelRepository.GetById(id);

            if (entity != null)
            {
                _accessLevelRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Cart

        [HttpGet("GetCartCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCartCount()
        {
            return _cartRepository.GetAll().Count();
        }

        [HttpGet("GetCartFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetCartFields()
        {
            return new Cart().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Cart>> GetCart(int limit, int page)
        {
            var dbList = _cartRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Cart>, List<Cart>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCartById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Cart?>> GetCartById(int id)
        {
            var dbEntity = await _cartRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Cart, Cart>(dbEntity);
        }

        [HttpPost("CreateCart")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Cart> CreateCart(Cart entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _cartRepository.Add(_mapper.Map<Cart, DB.Cart>(entity));
                return CreatedAtAction(nameof(CreateCart), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCart")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Cart> UpdateCart(Cart entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _cartRepository.Update(_mapper.Map<Cart, DB.Cart>(entity));
                return CreatedAtAction(nameof(UpdateCart), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCart(int id)
        {
            var entity = await _cartRepository.GetById(id);

            if (entity != null)
            {
                _cartRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Categories

        [HttpGet("GetCategoriesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCategoriesCount()
        {
            return _categoryRepository.GetAll().Count();
        }

        [HttpGet("GetCategoriesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetCategoriesFields()
        {
            return new Category().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCategories")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Category>> GetCategories(int limit, int page)
        {
            var dbList = _categoryRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Category>, List<Category>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCategoriesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Category?>> GetCategoriesById(int id)
        {
            var dbEntity = await _categoryRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Category, Category>(dbEntity);
        }

        [HttpPost("CreateCategories")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Category> CreateCategories(Category entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryRepository.Add(_mapper.Map<Category, DB.Category>(entity));
                return CreatedAtAction(nameof(CreateCategories), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCategories")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Category> UpdateCategories(Category entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryRepository.Update(_mapper.Map<Category, DB.Category>(entity));
                return CreatedAtAction(nameof(UpdateCategories), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCategories")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCategories(int id)
        {
            var entity = await _categoryRepository.GetById(id);

            if (entity != null)
            {
                _categoryRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region CategoryHierarchy

        [HttpGet("GetCategoryHierarchyCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCategoryHierarchyCount()
        {
            return _categoryHierarchyRepository.GetAll().Count();
        }

        [HttpGet("GetCategoryHierarchyFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetCategoryHierarchyFields()
        {
            return new CategoryHierarchy().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCategoryHierarchy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CategoryHierarchy>> GetCategoryHierarchy(int limit, int page)
        {
            var dbList = _categoryHierarchyRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.CategoryHierarchy>, List<CategoryHierarchy>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCategoryHierarchyById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryHierarchy?>> GetCategoryHierarchyById(int id)
        {
            var dbEntity = await _categoryHierarchyRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.CategoryHierarchy, CategoryHierarchy>(dbEntity);
        }

        [HttpPost("CreateCategoryHierarchy")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CategoryHierarchy> CreateCategoryHierarchy(CategoryHierarchy entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryHierarchyRepository.Add(_mapper.Map<CategoryHierarchy, DB.CategoryHierarchy>(entity));
                return CreatedAtAction(nameof(CreateCategoryHierarchy), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCategoryHierarchy")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CategoryHierarchy> UpdateCategoryHierarchy(CategoryHierarchy entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryHierarchyRepository.Update(_mapper.Map<CategoryHierarchy, DB.CategoryHierarchy>(entity));
                return CreatedAtAction(nameof(UpdateCategoryHierarchy), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCategoryHierarchy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCategoryHierarchy(int id)
        {
            var entity = await _categoryHierarchyRepository.GetById(id);

            if (entity != null)
            {
                _categoryHierarchyRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Colors

        [HttpGet("GetColorsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetColorsCount()
        {
            return _colorRepository.GetAll().Count();
        }

        [HttpGet("GetColorsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetColorsFields()
        {
            return new Color().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetColors")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Color>> GetColors(int limit, int page)
        {
            var dbList = _colorRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Color>, List<Color>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetColorsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Color?>> GetColorsById(int id)
        {
            var dbEntity = await _colorRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Color, Color>(dbEntity);
        }

        [HttpPost("CreateColors")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Color> CreateColors(Color entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _colorRepository.Add(_mapper.Map<Color, DB.Color>(entity));
                return CreatedAtAction(nameof(CreateColors), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateColors")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Color> UpdateColors(Color entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _colorRepository.Update(_mapper.Map<Color, DB.Color>(entity));
                return CreatedAtAction(nameof(UpdateColors), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteColors")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteColors(int id)
        {
            var entity = await _colorRepository.GetById(id);

            if (entity != null)
            {
                _colorRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Contacts

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

        [HttpGet("GetContactsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Contact?>> GetContactsById(int id)
        {
            var dbEntity = await _contactRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Contact, Contact>(dbEntity);
        }

        [HttpPost("CreateContacts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Contact> CreateContacts(Contact entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _contactRepository.Add(_mapper.Map<Contact, DB.Contact>(entity));
                return CreatedAtAction(nameof(CreateContacts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateContacts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Contact> UpdateContacts(Contact entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _contactRepository.Update(_mapper.Map<Contact, DB.Contact>(entity));
                return CreatedAtAction(nameof(UpdateContacts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteContacts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteContacts(int id)
        {
            var entity = await _contactRepository.GetById(id);

            if (entity != null)
            {
                _contactRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region CustomizableProducts

        [HttpGet("GetCustomizableProductsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCustomizableProductsCount()
        {
            return _customizableProductRepository.GetAll().Count();
        }

        [HttpGet("GetCustomizableProductsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetCustomizableProductsFields()
        {
            return new CustomizableProduct().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCustomizableProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CustomizableProduct>> GetCustomizableProducts(int limit, int page)
        {
            var dbList = _customizableProductRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.CustomizableProduct>, List<CustomizableProduct>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCustomizableProductsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CustomizableProduct?>> GetCustomizableProductsById(int id)
        {
            var dbEntity = await _customizableProductRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.CustomizableProduct, CustomizableProduct>(dbEntity);
        }

        [HttpPost("CreateCustomizableProducts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizableProduct> CreateCustomizableProducts(CustomizableProduct entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizableProductRepository.Add(_mapper.Map<CustomizableProduct, DB.CustomizableProduct>(entity));
                return CreatedAtAction(nameof(CreateCustomizableProducts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCustomizableProducts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizableProduct> UpdateCustomizableProducts(CustomizableProduct entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizableProductRepository.Update(_mapper.Map<CustomizableProduct, DB.CustomizableProduct>(entity));
                return CreatedAtAction(nameof(UpdateCustomizableProducts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCustomizableProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCustomizableProducts(int id)
        {
            var entity = await _customizableProductRepository.GetById(id);

            if (entity != null)
            {
                _customizableProductRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region CustomizationOrders

        [HttpGet("GetCustomizationOrdersCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCustomizationOrdersCount()
        {
            return _customizationOrderRepository.GetAll().Count();
        }

        [HttpGet("GetCustomizationOrdersFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetCustomizationOrdersFields()
        {
            return new CustomizationOrder().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCustomizationOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CustomizationOrder>> GetCustomizationOrders(int limit, int page)
        {
            var dbList = _customizationOrderRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.CustomizationOrder>, List<CustomizationOrder>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCustomizationOrdersById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CustomizationOrder?>> GetCustomizationOrdersById(int id)
        {
            var dbEntity = await _customizationOrderRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.CustomizationOrder, CustomizationOrder>(dbEntity);
        }

        [HttpPost("CreateCustomizationOrders")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizationOrder> CreateCustomizationOrders(CustomizationOrder entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizationOrderRepository.Add(_mapper.Map<CustomizationOrder, DB.CustomizationOrder>(entity));
                return CreatedAtAction(nameof(CreateCustomizationOrders), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCustomizationOrders")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizationOrder> UpdateCustomizationOrders(CustomizationOrder entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizationOrderRepository.Update(_mapper.Map<CustomizationOrder, DB.CustomizationOrder>(entity));
                return CreatedAtAction(nameof(UpdateCustomizationOrders), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCustomizationOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCustomizationOrders(int id)
        {
            var entity = await _customizationOrderRepository.GetById(id);

            if (entity != null)
            {
                _customizationOrderRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region FabricTypes

        [HttpGet("GetFabricTypesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetFabricTypesCount()
        {
            return _fabricTypeRepository.GetAll().Count();
        }

        [HttpGet("GetFabricTypesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetFabricTypesFields()
        {
            return new FabricType().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetFabricTypes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<FabricType>> GetFabricTypes(int limit, int page)
        {
            var dbList = _fabricTypeRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.FabricType>, List<FabricType>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetFabricTypesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<FabricType?>> GetFabricTypesById(int id)
        {
            var dbEntity = await _fabricTypeRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.FabricType, FabricType>(dbEntity);
        }

        [HttpPost("CreateFabricTypes")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<FabricType> CreateFabricTypes(FabricType entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _fabricTypeRepository.Add(_mapper.Map<FabricType, DB.FabricType>(entity));
                return CreatedAtAction(nameof(CreateFabricTypes), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateFabricTypes")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<FabricType> UpdateFabricTypes(FabricType entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _fabricTypeRepository.Update(_mapper.Map<FabricType, DB.FabricType>(entity));
                return CreatedAtAction(nameof(UpdateFabricTypes), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteFabricTypes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteFabricTypes(int id)
        {
            var entity = await _fabricTypeRepository.GetById(id);

            if (entity != null)
            {
                _fabricTypeRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Languages

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
        public async Task<ActionResult<Language?>> GetLanguagesById(int id)
        {
            var dbEntity = await _languageRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Language, Language>(dbEntity);
        }

        [HttpPost("CreateLanguages")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> CreateLanguages(Language entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _languageRepository.Add(_mapper.Map<Language, DB.Language>(entity));
                return CreatedAtAction(nameof(CreateLanguages), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateLanguages")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> UpdateLanguages(Language entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _languageRepository.Update(_mapper.Map<Language, DB.Language>(entity));
                return CreatedAtAction(nameof(UpdateLanguages), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteLanguages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteLanguages(int id)
        {
            var entity = await _languageRepository.GetById(id);

            if (entity != null)
            {
                _languageRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Orders

        [HttpGet("GetOrderCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetOrdersCount()
        {
            return _orderRepository.GetAll().Count();
        }

        [HttpGet("GetOrdersFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetOrdersFields()
        {
            return new Order().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Order>> GetOrders(int limit, int page)
        {
            var dbList = _orderRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Order>, List<Order>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetOrdersById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Order?>> GetOrdersById(int id)
        {
            var dbEntity = await _orderRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Order, Order>(dbEntity);
        }

        [HttpPost("CreateOrders")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Order> CreateOrders(Order entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderRepository.Add(_mapper.Map<Order, DB.Order>(entity));
                return CreatedAtAction(nameof(CreateOrders), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateOrders")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Order> UpdateOrders(Order entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderRepository.Update(_mapper.Map<Order, DB.Order>(entity));
                return CreatedAtAction(nameof(UpdateOrders), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteOrders(int id)
        {
            var entity = await _orderRepository.GetById(id);

            if (entity != null)
            {
                _orderRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region OrderHistory

        [HttpGet("GetOrderHistoryCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetOrderHistoryCount()
        {
            return _orderHistoryRepository.GetAll().Count();
        }

        [HttpGet("GetOrderHistoryFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetOrderHistoryFields()
        {
            return new OrderHistory().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetOrderHistory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<OrderHistory>> GetOrderHistory(int limit, int page)
        {
            var dbList = _orderHistoryRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.OrderHistory>, List<OrderHistory>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetOrderHistoryById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderHistory?>> GetOrderHistoryById(int id)
        {
            var dbEntity = await _orderHistoryRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.OrderHistory, OrderHistory>(dbEntity);
        }

        [HttpPost("CreateOrderHistory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderHistory> CreateOrderHistory(OrderHistory entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderHistoryRepository.Add(_mapper.Map<OrderHistory, DB.OrderHistory>(entity));
                return CreatedAtAction(nameof(CreateOrderHistory), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateOrderHistory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderHistory> UpdateOrderHistory(OrderHistory entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderHistoryRepository.Update(_mapper.Map<OrderHistory, DB.OrderHistory>(entity));
                return CreatedAtAction(nameof(UpdateOrderHistory), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteOrderHistory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteOrderHistory(int id)
        {
            var entity = await _orderHistoryRepository.GetById(id);

            if (entity != null)
            {
                _orderHistoryRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region OrderStatuses

        [HttpGet("GetOrderStatusesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetOrderStatusesCount()
        {
            return _orderStatusRepository.GetAll().Count();
        }

        [HttpGet("GetOrderStatusesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetOrderStatusesFields()
        {
            return new OrderStatus().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetOrderStatuses")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<OrderStatus>> GetOrderStatuses(int limit, int page)
        {
            var dbList = _orderStatusRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.OrderStatus>, List<OrderStatus>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetOrderStatusesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderStatus?>> GetOrderStatusesById(int id)
        {
            var dbEntity = await _orderStatusRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.OrderStatus, OrderStatus>(dbEntity);
        }

        [HttpPost("CreateOrderStatuses")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderStatus> CreateOrderStatuses(OrderStatus entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderStatusRepository.Add(_mapper.Map<OrderStatus, DB.OrderStatus>(entity));
                return CreatedAtAction(nameof(CreateOrderStatuses), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateOrderStatuses")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderStatus> UpdateOrderStatuses(OrderStatus entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderStatusRepository.Update(_mapper.Map<OrderStatus, DB.OrderStatus>(entity));
                return CreatedAtAction(nameof(UpdateOrderStatuses), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteOrderStatuses")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteOrderStatuses(int id)
        {
            var entity = await _orderStatusRepository.GetById(id);

            if (entity != null)
            {
                _orderStatusRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Payments

        [HttpGet("GetPaymentsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetPaymentsCount()
        {
            return _paymentRepository.GetAll().Count();
        }

        [HttpGet("GetPaymentsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetPaymentsFields()
        {
            return new Payment().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetPayments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Payment>> GetPayments(int limit, int page)
        {
            var dbList = _paymentRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Payment>, List<Payment>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetPaymentsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Payment?>> GetPaymentsById(int id)
        {
            var dbEntity = await _paymentRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Payment, Payment>(dbEntity);
        }

        [HttpPost("CreatePayments")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Payment> CreatePayments(Payment entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _paymentRepository.Add(_mapper.Map<Payment, DB.Payment>(entity));
                return CreatedAtAction(nameof(CreatePayments), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdatePayments")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Payment> UpdatePayments(Payment entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _paymentRepository.Update(_mapper.Map<Payment, DB.Payment>(entity));
                return CreatedAtAction(nameof(UpdatePayments), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeletePayments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeletePayments(int id)
        {
            var entity = await _paymentRepository.GetById(id);

            if (entity != null)
            {
                _paymentRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Products

        [HttpGet("GetProductsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetProductsCount()
        {
            return _productRepository.GetAll().Count();
        }

        [HttpGet("GetProductsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetProductsFields()
        {
            return new Product().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Product>> GetProducts(int limit, int page)
        {
            var dbList = _productRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Product>, List<Product>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetProductsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Product?>> GetProductsById(int id)
        {
            var dbEntity = await _productRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Product, Product>(dbEntity);
        }

        [HttpPost("CreateProducts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Product> CreateProducts(Product entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productRepository.Add(_mapper.Map<Product, DB.Product>(entity));
                return CreatedAtAction(nameof(CreateProducts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProducts")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Product> UpdateProducts(Product entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productRepository.Update(_mapper.Map<Product, DB.Product>(entity));
                return CreatedAtAction(nameof(UpdateProducts), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteProducts(int id)
        {
            var entity = await _productRepository.GetById(id);

            if (entity != null)
            {
                _productRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region ProductImages

        [HttpGet("GetProductImagesCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetProductImagesCount()
        {
            return _productImageRepository.GetAll().Count();
        }

        [HttpGet("GetProductImagesFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetProductImagesFields()
        {
            return new ProductImage().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetProductImages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ProductImage>> GetProductImages(int limit, int page)
        {
            var dbList = _productImageRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.ProductImage>, List<ProductImage>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetProductImagesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductImage?>> GetProductImagesById(int id)
        {
            var dbEntity = await _productImageRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.ProductImage, ProductImage>(dbEntity);
        }

        [HttpPost("CreateProductImages")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductImage> CreateProductImages(ProductImage entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productImageRepository.Add(_mapper.Map<ProductImage, DB.ProductImage>(entity));
                return CreatedAtAction(nameof(CreateProductImages), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProductImages")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductImage> UpdateProductImages(ProductImage entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productImageRepository.Update(_mapper.Map<ProductImage, DB.ProductImage>(entity));
                return CreatedAtAction(nameof(UpdateProductImages), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProductImages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteProductImages(int id)
        {
            var entity = await _productImageRepository.GetById(id);

            if (entity != null)
            {
                _productImageRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region ProductTranslations

        [HttpGet("GetProductTranslationsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetProductTranslationsCount()
        {
            return _productTranslationRepository.GetAll().Count();
        }

        [HttpGet("GetProductTranslationsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetProductTranslationsFields()
        {
            return new ProductTranslation().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetProductTranslations")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ProductTranslation>> GetProductTranslations(int limit, int page)
        {
            var dbList = _productTranslationRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.ProductTranslation>, List<ProductTranslation>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetProductTranslationsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductTranslation?>> GetProductTranslationsById(int id)
        {
            var dbEntity = await _productTranslationRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.ProductTranslation, ProductTranslation>(dbEntity);
        }

        [HttpPost("CreateProductTranslations")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductTranslation> CreateProductTranslations(ProductTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productTranslationRepository.Add(_mapper.Map<ProductTranslation, DB.ProductTranslation>(entity));
                return CreatedAtAction(nameof(CreateProductTranslations), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProductTranslations")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductTranslation> UpdateProductTranslations(ProductTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productTranslationRepository.Update(_mapper.Map<ProductTranslation, DB.ProductTranslation>(entity));
                return CreatedAtAction(nameof(UpdateProductTranslations), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProductTranslations")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteProductTranslations(int id)
        {
            var entity = await _productTranslationRepository.GetById(id);

            if (entity != null)
            {
                _productTranslationRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Reviews

        [HttpGet("GetReviewsCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetReviewsCount()
        {
            return _reviewRepository.GetAll().Count();
        }

        [HttpGet("GetReviewsFields")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<string> GetReviewsFields()
        {
            return new Review().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetReviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Review>> GetReviews(int limit, int page)
        {
            var dbList = _reviewRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Review>, List<Review>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetReviewsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Review?>> GetReviewsById(int id)
        {
            var dbEntity = await _reviewRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.Review, Review>(dbEntity);
        }

        [HttpPost("CreateReviews")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Review> CreateReviews(Review entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _reviewRepository.Add(_mapper.Map<Review, DB.Review>(entity));
                return CreatedAtAction(nameof(CreateReviews), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateReviews")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Review> UpdateReviews(Review entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _reviewRepository.Update(_mapper.Map<Review, DB.Review>(entity));
                return CreatedAtAction(nameof(UpdateReviews), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteReviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteReviews(int id)
        {
            var entity = await _reviewRepository.GetById(id);

            if (entity != null)
            {
                _reviewRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Users

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

        [HttpGet("GetUsersById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<User?>> GetUsersById(int id)
        {
            var dbEntity = await _userRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.User, User>(dbEntity);
        }

        [HttpPost("CreateUsers")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<User> CreateUsers(User entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRepository.Add(_mapper.Map<User, DB.User>(entity));
                return CreatedAtAction(nameof(CreateUsers), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUsers")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<User> UpdateUsers(User entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRepository.Update(_mapper.Map<User, DB.User>(entity));
                return CreatedAtAction(nameof(UpdateUsers), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUsers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteUsers(int id)
        {
            var entity = await _userRepository.GetById(id);

            if (entity != null)
            {
                _userRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region UserProfiles

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
        public async Task<ActionResult<UserProfile?>> GetUserProfilesById(int id)
        {
            var dbEntity = await _userProfileRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.UserProfile, UserProfile>(dbEntity);
        }

        [HttpPost("CreateUserProfiles")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserProfile> CreateUserProfiles(UserProfile entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userProfileRepository.Add(_mapper.Map<UserProfile, DB.UserProfile>(entity));
                return CreatedAtAction(nameof(CreateUserProfiles), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUserProfiles")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserProfile> UpdateUserProfiles(UserProfile entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userProfileRepository.Update(_mapper.Map<UserProfile, DB.UserProfile>(entity));
                return CreatedAtAction(nameof(UpdateUserProfiles), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUserProfiles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteUserProfiles(int id)
        {
            var entity = await _userProfileRepository.GetById(id);

            if (entity != null)
            {
                _userProfileRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region UserRoles

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

        [HttpGet("GetUserRolesById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserRole?>> GetUserRolesById(int id)
        {
            var dbEntity = await _userRoleRepository.GetById(id);
            if (dbEntity == null)
            {
                return NotFound();
            }

            return dbEntity == null ? NotFound() : _mapper.Map<DB.UserRole, UserRole>(dbEntity);
        }

        [HttpPost("CreateUserRoles")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserRole> CreateUserRoles(UserRole entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRoleRepository.Add(_mapper.Map<UserRole, DB.UserRole>(entity));
                return CreatedAtAction(nameof(CreateUserRoles), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateUserRoles")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserRole> UpdateUserRoles(UserRole entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _userRoleRepository.Update(_mapper.Map<UserRole, DB.UserRole>(entity));
                return CreatedAtAction(nameof(UpdateUserRoles), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteUserRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteUserRoles(int id)
        {
            var entity = await _userRoleRepository.GetById(id);

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
        public async Task<string?> GetFkAccessLevelsData(int id)
        {
            try
            {
                var dbEntity = await _accessLevelRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Level: {dbEntity?.Level} | Description: {dbEntity?.Description}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkLanguagesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkLanguagesData(int id)
        {
            try
            {
                var dbEntity = await _languageRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | FullName: {dbEntity?.FullName} | Abbreviation: {dbEntity?.Abbreviation} | Description: {dbEntity?.Description}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkCategoriesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkCategoriesData(int id)
        {
            try
            {
                var dbEntity = await _categoryRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Name: {dbEntity?.Name} | ParentID: {dbEntity?.Description}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkFabricTypesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkFabricTypesData(int id)
        {
            try
            {
                var dbEntity = await _fabricTypeRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Name: {dbEntity?.Name}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkProductsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkProductsData(int id)
        {
            try
            {
                var dbEntity = await _productRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Price: {dbEntity?.Price}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkProductImagesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkProductImagesData(int id)
        {
            try
            {
                var dbEntity = await _productImageRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | ImagePath: {dbEntity?.ImageData} | ProductID: {dbEntity?.FkProducts}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkProductTranslationsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkProductTranslationsData(int id)
        {
            try
            {
                var dbEntity = await _productTranslationRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Name: {dbEntity?.Name} | Description: {dbEntity?.Description} | LanguageID: {dbEntity?.FkLanguages}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkReviewsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkReviewsData(int id)
        {
            try
            {
                var dbEntity = await _reviewRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Rating: {dbEntity?.Rating} | Comment: {dbEntity?.Comment} | ProductID: {dbEntity?.FkProducts} | UserID: {dbEntity?.FkUsers}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkOrdersData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkOrdersData(int id)
        {
            try
            {
                var dbEntity = await _orderRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | StatusID: {dbEntity?.FkOrderStatus}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkOrderHistoryData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkOrderHistoryData(int id)
        {
            try
            {
                var dbEntity = await _orderHistoryRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | StatusID: {dbEntity?.Status}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkPaymentsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkPaymentsData(int id)
        {
            try
            {
                var dbEntity = await _paymentRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Amount: {dbEntity?.Amount} | PaymentMethod: {dbEntity?.PaymentMethod}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkUsersData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkUsersData(int id)
        {
            try
            {
                var dbEntity = await _userRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Login: {dbEntity?.Login}| Email: {dbEntity?.Email}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        [HttpGet("GetFkUserRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<string?> GetFkUserRoles(int id)
        {
            try
            {
                var dbEntity = await _userRoleRepository.GetById(id);
                return dbEntity == null
                    ? string.Empty
                    : $"Id: {dbEntity?.Id} | Name: {dbEntity?.Name}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching data: {ex.Message}");
                throw;
            }
        }

        #endregion
    }
}
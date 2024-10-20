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
        public IEnumerable<string> GetCartsFields()
        {
            return new Cart().GetType().GetProperties().Select(x => x.Name);
        }

        [HttpGet("GetCarts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<Cart>> GetCarts(int limit, int page)
        {
            var dbList = _cartRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.Cart>, List<Cart>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCartById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Cart?> GetCartById(int id)
        {
            var dbEntity = _cartRepository.GetById(id);
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
        public ActionResult DeleteCart(int id)
        {
            var entity = _cartRepository.GetById(id);

            if (entity != null)
            {
                _cartRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Categories table

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

        [HttpGet("GetCategoryById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Category?> GetCategoryById(int id)
        {
            var dbEntity = _categoryRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Category, Category>(dbEntity);
        }

        [HttpPost("CreateCategory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Category> CreateCategory(Category entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryRepository.Add(_mapper.Map<Category, DB.Category>(entity));
                return CreatedAtAction(nameof(CreateCategory), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCategory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Category> UpdateCategory(Category entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _categoryRepository.Update(_mapper.Map<Category, DB.Category>(entity));
                return CreatedAtAction(nameof(UpdateCategory), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteCategory(int id)
        {
            var entity = _categoryRepository.GetById(id);

            if (entity != null)
            {
                _categoryRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region CategoryHierarchy table

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

        [HttpGet("GetCategoryHierarchies")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CategoryHierarchy>> GetCategoryHierarchies(int limit, int page)
        {
            var dbList = _categoryHierarchyRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.CategoryHierarchy>, List<CategoryHierarchy>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetCategoryHierarchyById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CategoryHierarchy?> GetCategoryHierarchyById(int id)
        {
            var dbEntity = _categoryHierarchyRepository.GetById(id);
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
        public ActionResult DeleteCategoryHierarchy(int id)
        {
            var entity = _categoryHierarchyRepository.GetById(id);

            if (entity != null)
            {
                _categoryHierarchyRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Color

        [HttpGet("GetColorCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetColorCount()
        {
            return _colorRepository.GetAll().Count();
        }

        [HttpGet("GetColorFields")]
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

        [HttpGet("GetColorById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Color?> GetColorById(int id)
        {
            var dbEntity = _colorRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Color, Color>(dbEntity);
        }

        [HttpPost("CreateColor")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Color> CreateColor(Color entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _colorRepository.Add(_mapper.Map<Color, DB.Color>(entity));
                return CreatedAtAction(nameof(CreateColor), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateColor")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Color> UpdateColor(Color entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _colorRepository.Update(_mapper.Map<Color, DB.Color>(entity));
                return CreatedAtAction(nameof(UpdateColor), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteColor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteColor(int id)
        {
            var entity = _colorRepository.GetById(id);

            if (entity != null)
            {
                _colorRepository.Delete(entity);
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

        #region CustomizableProduct

        [HttpGet("GetCustomizableProductCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCustomizableProductCount()
        {
            return _customizableProductRepository.GetAll().Count();
        }

        [HttpGet("GetCustomizableProductFields")]
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

        [HttpGet("GetCustomizableProductById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CustomizableProduct?> GetCustomizableProductById(int id)
        {
            var dbEntity = _customizableProductRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.CustomizableProduct, CustomizableProduct>(dbEntity);
        }

        [HttpPost("CreateCustomizableProduct")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizableProduct> CreateCustomizableProduct(CustomizableProduct entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizableProductRepository.Add(_mapper.Map<CustomizableProduct, DB.CustomizableProduct>(entity));
                return CreatedAtAction(nameof(CreateCustomizableProduct), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCustomizableProduct")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizableProduct> UpdateCustomizableProduct(CustomizableProduct entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizableProductRepository.Update(_mapper.Map<CustomizableProduct, DB.CustomizableProduct>(entity));
                return CreatedAtAction(nameof(UpdateCustomizableProduct), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCustomizableProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteCustomizableProduct(int id)
        {
            var entity = _customizableProductRepository.GetById(id);

            if (entity != null)
            {
                _customizableProductRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region CustomizationOrder

        [HttpGet("GetCustomizationOrderCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetCustomizationOrderCount()
        {
            return _customizationOrderRepository.GetAll().Count();
        }

        [HttpGet("GetCustomizationOrderFields")]
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

        [HttpGet("GetCustomizationOrderById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CustomizationOrder?> GetCustomizationOrderById(int id)
        {
            var dbEntity = _customizationOrderRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.CustomizationOrder, CustomizationOrder>(dbEntity);
        }

        [HttpPost("CreateCustomizationOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizationOrder> CreateCustomizationOrder(CustomizationOrder entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizationOrderRepository.Add(_mapper.Map<CustomizationOrder, DB.CustomizationOrder>(entity));
                return CreatedAtAction(nameof(CreateCustomizationOrder), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateCustomizationOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CustomizationOrder> UpdateCustomizationOrder(CustomizationOrder entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _customizationOrderRepository.Update(_mapper.Map<CustomizationOrder, DB.CustomizationOrder>(entity));
                return CreatedAtAction(nameof(UpdateCustomizationOrder), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteCustomizationOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteCustomizationOrder(int id)
        {
            var entity = _customizationOrderRepository.GetById(id);

            if (entity != null)
            {
                _customizationOrderRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region FabricTypes table

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

        [HttpGet("GetFabricTypeById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<FabricType?> GetFabricTypeById(int id)
        {
            var dbEntity = _fabricTypeRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.FabricType, FabricType>(dbEntity);
        }

        [HttpPost("CreateFabricType")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<FabricType> CreateFabricType(FabricType entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _fabricTypeRepository.Add(_mapper.Map<FabricType, DB.FabricType>(entity));
                return CreatedAtAction(nameof(CreateFabricType), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateFabricType")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<FabricType> UpdateFabricType(FabricType entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _fabricTypeRepository.Update(_mapper.Map<FabricType, DB.FabricType>(entity));
                return CreatedAtAction(nameof(UpdateFabricType), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteFabricType")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteFabricType(int id)
        {
            var entity = _fabricTypeRepository.GetById(id);

            if (entity != null)
            {
                _fabricTypeRepository.Delete(entity);
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

        [HttpGet("GetLanguageById")]
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

        #region Order

        [HttpGet("GetOrderCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetOrderCount()
        {
            return _orderRepository.GetAll().Count();
        }

        [HttpGet("GetOrderFields")]
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

        [HttpGet("GetOrderById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Order?> GetOrderById(int id)
        {
            var dbEntity = _orderRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Order, Order>(dbEntity);
        }

        [HttpPost("CreateOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Order> CreateOrder(Order entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderRepository.Add(_mapper.Map<Order, DB.Order>(entity));
                return CreatedAtAction(nameof(CreateOrder), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Order> UpdateOrder(Order entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderRepository.Update(_mapper.Map<Order, DB.Order>(entity));
                return CreatedAtAction(nameof(UpdateOrder), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteOrder(int id)
        {
            var entity = _orderRepository.GetById(id);

            if (entity != null)
            {
                _orderRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region OrderHistory table

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

        [HttpGet("GetOrderHistories")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<OrderHistory>> GetOrderHistories(int limit, int page)
        {
            var dbList = _orderHistoryRepository.GetAll().ToList().OrderBy(x => x.Id).Skip((page - 1) * limit).Take(limit).ToList();
            var apiList = _mapper.Map<List<DB.OrderHistory>, List<OrderHistory>>(dbList);

            return apiList == null ? NotFound() : apiList;
        }

        [HttpGet("GetOrderHistoryById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<OrderHistory?> GetOrderHistoryById(int id)
        {
            var dbEntity = _orderHistoryRepository.GetById(id);
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
        public ActionResult DeleteOrderHistory(int id)
        {
            var entity = _orderHistoryRepository.GetById(id);

            if (entity != null)
            {
                _orderHistoryRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region OrderStatuses table

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

        [HttpGet("GetOrderStatusById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<OrderStatus?> GetOrderStatusById(int id)
        {
            var dbEntity = _orderStatusRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.OrderStatus, OrderStatus>(dbEntity);
        }

        [HttpPost("CreateOrderStatus")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderStatus> CreateOrderStatus(OrderStatus entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderStatusRepository.Add(_mapper.Map<OrderStatus, DB.OrderStatus>(entity));
                return CreatedAtAction(nameof(CreateOrderStatus), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateOrderStatus")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<OrderStatus> UpdateOrderStatus(OrderStatus entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _orderStatusRepository.Update(_mapper.Map<OrderStatus, DB.OrderStatus>(entity));
                return CreatedAtAction(nameof(UpdateOrderStatus), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteOrderStatus")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteOrderStatus(int id)
        {
            var entity = _orderStatusRepository.GetById(id);

            if (entity != null)
            {
                _orderStatusRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Payment

        [HttpGet("GetPaymentCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public int GetPaymentCount()
        {
            return _paymentRepository.GetAll().Count();
        }

        [HttpGet("GetPaymentFields")]
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

        [HttpGet("GetPaymentById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Payment?> GetPaymentById(int id)
        {
            var dbEntity = _paymentRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Payment, Payment>(dbEntity);
        }

        [HttpPost("CreatePayment")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Payment> CreatePayment(Payment entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _paymentRepository.Add(_mapper.Map<Payment, DB.Payment>(entity));
                return CreatedAtAction(nameof(CreatePayment), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdatePayment")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Payment> UpdatePayment(Payment entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _paymentRepository.Update(_mapper.Map<Payment, DB.Payment>(entity));
                return CreatedAtAction(nameof(UpdatePayment), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeletePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeletePayment(int id)
        {
            var entity = _paymentRepository.GetById(id);

            if (entity != null)
            {
                _paymentRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Products table

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

        [HttpGet("GetProductById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Product?> GetProductById(int id)
        {
            var dbEntity = _productRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Product, Product>(dbEntity);
        }

        [HttpPost("CreateProduct")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Product> CreateProduct(Product entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productRepository.Add(_mapper.Map<Product, DB.Product>(entity));
                return CreatedAtAction(nameof(CreateProduct), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProduct")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Product> UpdateProduct(Product entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productRepository.Update(_mapper.Map<Product, DB.Product>(entity));
                return CreatedAtAction(nameof(UpdateProduct), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteProduct(int id)
        {
            var entity = _productRepository.GetById(id);

            if (entity != null)
            {
                _productRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region ProductImages table

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

        [HttpGet("GetProductImageById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductImage?> GetProductImageById(int id)
        {
            var dbEntity = _productImageRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.ProductImage, ProductImage>(dbEntity);
        }

        [HttpPost("CreateProductImage")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductImage> CreateProductImage(ProductImage entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productImageRepository.Add(_mapper.Map<ProductImage, DB.ProductImage>(entity));
                return CreatedAtAction(nameof(CreateProductImage), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProductImage")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductImage> UpdateProductImage(ProductImage entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productImageRepository.Update(_mapper.Map<ProductImage, DB.ProductImage>(entity));
                return CreatedAtAction(nameof(UpdateProductImage), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProductImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteProductImage(int id)
        {
            var entity = _productImageRepository.GetById(id);

            if (entity != null)
            {
                _productImageRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region ProductTranslations table

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

        [HttpGet("GetProductTranslationById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductTranslation?> GetProductTranslationById(int id)
        {
            var dbEntity = _productTranslationRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.ProductTranslation, ProductTranslation>(dbEntity);
        }

        [HttpPost("CreateProductTranslation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductTranslation> CreateProductTranslation(ProductTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productTranslationRepository.Add(_mapper.Map<ProductTranslation, DB.ProductTranslation>(entity));
                return CreatedAtAction(nameof(CreateProductTranslation), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateProductTranslation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ProductTranslation> UpdateProductTranslation(ProductTranslation entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _productTranslationRepository.Update(_mapper.Map<ProductTranslation, DB.ProductTranslation>(entity));
                return CreatedAtAction(nameof(UpdateProductTranslation), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteProductTranslation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteProductTranslation(int id)
        {
            var entity = _productTranslationRepository.GetById(id);

            if (entity != null)
            {
                _productTranslationRepository.Delete(entity);
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        #region Reviews table

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

        [HttpGet("GetReviewById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Review?> GetReviewById(int id)
        {
            var dbEntity = _reviewRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.Review, Review>(dbEntity);
        }

        [HttpPost("CreateReview")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Review> CreateReview(Review entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _reviewRepository.Add(_mapper.Map<Review, DB.Review>(entity));
                return CreatedAtAction(nameof(CreateReview), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpPut("UpdateReview")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Review> UpdateReview(Review entity)
        {
            if (entity == null)
                return BadRequest();

            try
            {
                _reviewRepository.Update(_mapper.Map<Review, DB.Review>(entity));
                return CreatedAtAction(nameof(UpdateReview), new { id = entity.Id }, entity);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exc.InnerException);
            }
        }

        [HttpDelete("DeleteReview")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult DeleteReview(int id)
        {
            var entity = _reviewRepository.GetById(id);

            if (entity != null)
            {
                _reviewRepository.Delete(entity);
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

        [HttpGet("GetUserProfileById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserProfile?> GetUserProfileById(int id)
        {
            var dbEntity = _userProfileRepository.GetById(id);
            return dbEntity == null ? NotFound() : _mapper.Map<DB.UserProfile, UserProfile>(dbEntity);
        }

        [HttpPost("CreateUserProfile")]
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

        [HttpGet("GetFkCategoriesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkCategoriesData(int id)
        {
            var dbEntity = _categoryRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Name: {dbEntity?.Name} | ParentID: {dbEntity?.Description}";
        }

        [HttpGet("GetFkFabricTypesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkFabricTypesData(int id)
        {
            var dbEntity = _fabricTypeRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Name: {dbEntity?.Name}";
        }

        [HttpGet("GetFkProductsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkProductsData(int id)
        {
            var dbEntity = _productRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Id: {dbEntity?.Id} | Price: {dbEntity?.Price}";
        }

        [HttpGet("GetFkProductImagesData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkProductImagesData(int id)
        {
            var dbEntity = _productImageRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"ImagePath: {dbEntity?.ImageData} | ProductID: {dbEntity?.FkProducts}";
        }

        [HttpGet("GetFkProductTranslationsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkProductTranslationsData(int id)
        {
            var dbEntity = _productTranslationRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Name: {dbEntity?.Name} | Description: {dbEntity?.Description} | LanguageID: {dbEntity?.FkLanguages}";
        }

        [HttpGet("GetFkReviewsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkReviewsData(int id)
        {
            var dbEntity = _reviewRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"Rating: {dbEntity?.Rating} | Comment: {dbEntity?.Comment} | ProductID: {dbEntity?.FkProducts} | UserID: {dbEntity?.FkUsers}";
        }

        [HttpGet("GetFkOrdersData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkOrdersData(int id)
        {
            var dbEntity = _orderRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"UserID: {dbEntity?.FkUsers} | StatusID: {dbEntity?.FkOrderStatus}";
        }

        [HttpGet("GetFkOrderHistoryData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkOrderHistoryData(int id)
        {
            var dbEntity = _orderHistoryRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"OrderID: {dbEntity?.Id} | StatusID: {dbEntity?.Status}";
        }

        [HttpGet("GetFkPaymentsData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public string? GetFkPaymentsData(int id)
        {
            var dbEntity = _paymentRepository.GetById(id);
            return dbEntity == null
                ? string.Empty
                : $"OrderID: {dbEntity?.Id} | Amount: {dbEntity?.Amount} | PaymentMethod: {dbEntity?.PaymentMethod}";
        }

        #endregion
    }
}
using AutoMapper;
using DB = DatabaseProvider.Models;
using API = RestAPI.Models;

namespace RestAPI.AutoMapper
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
            // Provide all the Mapping Configuration
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AllowNullCollections = true;
                cfg.AddGlobalIgnore("Item");

                #region API -> DB

                // Configuring API to Database
                cfg.CreateMap<API.About, DB.About>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Header, opt => opt.MapFrom(s => s.Header))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<API.AccessLevel, DB.AccessLevel>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<API.BeltConstructor, DB.BeltConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkBeltConstructor, opt => opt.MapFrom(s => s.FkBeltConstructor))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<API.BeltType, DB.BeltType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.Cart, DB.Cart>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProductOrders, opt => opt.MapFrom(s => s.FkProductOrders))
                    .ForMember(d => d.FkCurrencies, opt => opt.MapFrom(s => s.FkCurrencies))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.Amount))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt));

                cfg.CreateMap<API.Category, DB.Category>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<API.CategoryHierarchy, DB.CategoryHierarchy>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ParentId, opt => opt.MapFrom(s => s.ParentId))
                    .ForMember(d => d.FkCategories, opt => opt.MapFrom(s => s.FkCategories));

                cfg.CreateMap<API.Color, DB.Color>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.Contact, DB.Contact>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email));

                cfg.CreateMap<API.Country, DB.Country>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                cfg.CreateMap<API.Currency, DB.Currency>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                cfg.CreateMap<API.CustomizableProduct, DB.CustomizableProduct>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSportSuitConstructor, opt => opt.MapFrom(s => s.FkSportSuitConstructor))
                    .ForMember(d => d.FkFabricTypes, opt => opt.MapFrom(s => s.FkFabricTypes))
                    .ForMember(d => d.FkSizeOptions, opt => opt.MapFrom(s => s.FkSizeOptions))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.CustomizationDetails, opt => opt.MapFrom(s => s.CustomizationDetails))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<API.FabricType, DB.FabricType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<API.Language, DB.Language>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.FullName))
                    .ForMember(d => d.Abbreviation, opt => opt.MapFrom(s => s.Abbreviation))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.DateFormat, opt => opt.MapFrom(s => s.DateFormat))
                    .ForMember(d => d.TimeFormat, opt => opt.MapFrom(s => s.TimeFormat));

                cfg.CreateMap<API.NeckConstructor, DB.NeckConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkNeckTypes, opt => opt.MapFrom(s => s.FkNeckTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<API.NeckType, DB.NeckType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.Order, DB.Order>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProductOrders, opt => opt.MapFrom(s => s.FkProductOrders))
                    .ForMember(d => d.FkOrderStatus, opt => opt.MapFrom(s => s.FkOrderStatus))
                    .ForMember(d => d.FkPayments, opt => opt.MapFrom(s => s.FkPayments))
                    .ForMember(d => d.FkShippingAdresses, opt => opt.MapFrom(s => s.FkShippingAdresses))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.Amount))
                    .ForMember(d => d.OrderDate, opt => opt.MapFrom(s => s.OrderDate))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<API.OrderHistory, DB.OrderHistory>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkOrders, opt => opt.MapFrom(s => s.FkOrders))
                    .ForMember(d => d.FkOrderStatuses, opt => opt.MapFrom(s => s.FkOrderStatuses))
                    .ForMember(d => d.ChangedAt, opt => opt.MapFrom(s => s.ChangedAt));

                cfg.CreateMap<API.OrderStatus, DB.OrderStatus>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status));

                cfg.CreateMap<API.PantsConstructor, DB.PantsConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPantsTypes, opt => opt.MapFrom(s => s.FkPantsTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<API.PantsCuffConstructor, DB.PantsCuffConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPantsCuffTypes, opt => opt.MapFrom(s => s.FkPantsCuffTypes))
                    .ForMember(d => d.FkColorsLeft, opt => opt.MapFrom(s => s.FkColorsLeft))
                    .ForMember(d => d.FkColorsRight, opt => opt.MapFrom(s => s.FkColorsRight));

                cfg.CreateMap<API.PantsCuffType, DB.PantsCuffType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.PantsType, DB.PantsType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.Payment, DB.Payment>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPaymentMethods, opt => opt.MapFrom(s => s.FkPaymentMethods))
                    .ForMember(d => d.FkCurrencies, opt => opt.MapFrom(s => s.FkCurrencies))
                    .ForMember(d => d.FkPaymentStatuses, opt => opt.MapFrom(s => s.FkPaymentStatuses))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.PaymentDate, opt => opt.MapFrom(s => s.PaymentDate))
                    .ForMember(d => d.PaymentNumber, opt => opt.MapFrom(s => s.PaymentNumber));

                cfg.CreateMap<API.PaymentMethod, DB.PaymentMethod>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Method, opt => opt.MapFrom(s => s.Method));

                cfg.CreateMap<API.PaymentStatus, DB.PaymentStatus>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status));

                cfg.CreateMap<API.Product, DB.Product>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.StockQuantity, opt => opt.MapFrom(s => s.StockQuantity))
                    .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s.IsActive))
                    .ForMember(d => d.IsCustomizable, opt => opt.MapFrom(s => s.IsCustomizable))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<API.ProductImage, DB.ProductImage>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.ProductOrder, DB.ProductOrder>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.FkCustomizableProducts, opt => opt.MapFrom(s => s.FkCustomizableProducts));

                cfg.CreateMap<API.ProductTranslation, DB.ProductTranslation>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<API.Review, DB.Review>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.Rating, opt => opt.MapFrom(s => s.Rating))
                    .ForMember(d => d.Comment, opt => opt.MapFrom(s => s.Comment))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt));

                cfg.CreateMap<API.ShippingAdress, DB.ShippingAdress>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkCountries, opt => opt.MapFrom(s => s.FkCountries))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince));

                cfg.CreateMap<API.SizeOption, DB.SizeOption>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Size, opt => opt.MapFrom(s => s.Size));

                cfg.CreateMap<API.SleeveConstructor, DB.SleeveConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSleeveTypes, opt => opt.MapFrom(s => s.FkSleeveTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<API.SleeveCuffConstructor, DB.SleeveCuffConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSleeveCuffTypes, opt => opt.MapFrom(s => s.FkSleeveCuffTypes))
                    .ForMember(d => d.FkColorsLeft, opt => opt.MapFrom(s => s.FkColorsLeft))
                    .ForMember(d => d.FkColorsRight, opt => opt.MapFrom(s => s.FkColorsRight));

                cfg.CreateMap<API.SleeveCuffType, DB.SleeveCuffType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.SleeveType, DB.SleeveType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.SportSuitConstructor, DB.SportSuitConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSweaterConstructor, opt => opt.MapFrom(s => s.FkSweaterConstructor))
                    .ForMember(d => d.FkSleeveConstructor, opt => opt.MapFrom(s => s.FkSleeveConstructor))
                    .ForMember(d => d.FkSleeveCuffConstructor, opt => opt.MapFrom(s => s.FkSleeveCuffConstructor))
                    .ForMember(d => d.FkBeltConstructor, opt => opt.MapFrom(s => s.FkBeltConstructor))
                    .ForMember(d => d.FkPantsConstructor, opt => opt.MapFrom(s => s.FkPantsConstructor))
                    .ForMember(d => d.FkPantsCuffConstructor, opt => opt.MapFrom(s => s.FkPantsCuffConstructor));

                cfg.CreateMap<API.SweaterConstructor, DB.SweaterConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSweaterTypes, opt => opt.MapFrom(s => s.FkSweaterTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<API.SweaterType, DB.SweaterType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<API.User, DB.User>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUserRoles, opt => opt.MapFrom(s => s.FkUserRoles))
                    .ForMember(d => d.Login, opt => opt.MapFrom(s => s.Login))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))
                    .ForMember(d => d.Password, opt => opt.MapFrom(s => s.Password))
                    .ForMember(d => d.ConfirmEmail, opt => opt.MapFrom(s => s.ConfirmEmail))
                    .ForMember(d => d.Hash, opt => opt.MapFrom(s => s.Hash))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<API.UserProfile, DB.UserProfile>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                    .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                    .ForMember(d => d.MiddleName, opt => opt.MapFrom(s => s.MiddleName))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince))
                    .ForMember(d => d.Country, opt => opt.MapFrom(s => s.Country))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Avatar, opt => opt.MapFrom(s => s.Avatar))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<API.UserRole, DB.UserRole>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkAccessLevels, opt => opt.MapFrom(s => s.FkAccessLevels))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                #endregion

                #region DB -> API

                cfg.CreateMap<DB.About, API.About>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Header, opt => opt.MapFrom(s => s.Header))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<DB.AccessLevel, API.AccessLevel>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<DB.BeltConstructor, API.BeltConstructor>()
                   .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                   .ForMember(d => d.FkBeltConstructor, opt => opt.MapFrom(s => s.FkBeltConstructor))
                   .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<DB.BeltType, API.BeltType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.Cart, API.Cart>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProductOrders, opt => opt.MapFrom(s => s.FkProductOrders))
                    .ForMember(d => d.FkCurrencies, opt => opt.MapFrom(s => s.FkCurrencies))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.Amount))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt));

                cfg.CreateMap<DB.Category, API.Category>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<DB.CategoryHierarchy, API.CategoryHierarchy>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ParentId, opt => opt.MapFrom(s => s.ParentId))
                    .ForMember(d => d.FkCategories, opt => opt.MapFrom(s => s.FkCategories));

                cfg.CreateMap<DB.Color, API.Color>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.Contact, API.Contact>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email));

                cfg.CreateMap<DB.Country, API.Country>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                cfg.CreateMap<DB.Currency, API.Currency>()
                  .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                  .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                cfg.CreateMap<DB.CustomizableProduct, API.CustomizableProduct>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSportSuitConstructor, opt => opt.MapFrom(s => s.FkSportSuitConstructor))
                    .ForMember(d => d.FkFabricTypes, opt => opt.MapFrom(s => s.FkFabricTypes))
                    .ForMember(d => d.FkSizeOptions, opt => opt.MapFrom(s => s.FkSizeOptions))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.CustomizationDetails, opt => opt.MapFrom(s => s.CustomizationDetails))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<DB.FabricType, API.FabricType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<DB.Language, API.Language>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.FullName))
                    .ForMember(d => d.Abbreviation, opt => opt.MapFrom(s => s.Abbreviation))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.DateFormat, opt => opt.MapFrom(s => s.DateFormat))
                    .ForMember(d => d.TimeFormat, opt => opt.MapFrom(s => s.TimeFormat));

                cfg.CreateMap<DB.NeckConstructor, API.NeckConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkNeckTypes, opt => opt.MapFrom(s => s.FkNeckTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<DB.NeckType, API.NeckType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.Order, API.Order>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProductOrders, opt => opt.MapFrom(s => s.FkProductOrders))
                    .ForMember(d => d.FkOrderStatus, opt => opt.MapFrom(s => s.FkOrderStatus))
                    .ForMember(d => d.FkPayments, opt => opt.MapFrom(s => s.FkPayments))
                    .ForMember(d => d.FkShippingAdresses, opt => opt.MapFrom(s => s.FkShippingAdresses))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.Amount))
                    .ForMember(d => d.OrderDate, opt => opt.MapFrom(s => s.OrderDate))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<DB.OrderHistory, API.OrderHistory>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkOrders, opt => opt.MapFrom(s => s.FkOrders))
                    .ForMember(d => d.FkOrderStatuses, opt => opt.MapFrom(s => s.FkOrderStatuses))
                    .ForMember(d => d.ChangedAt, opt => opt.MapFrom(s => s.ChangedAt));

                cfg.CreateMap<DB.OrderStatus, API.OrderStatus>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status));

                cfg.CreateMap<DB.PantsConstructor, API.PantsConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPantsTypes, opt => opt.MapFrom(s => s.FkPantsTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<DB.PantsCuffConstructor, API.PantsCuffConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPantsCuffTypes, opt => opt.MapFrom(s => s.FkPantsCuffTypes))
                    .ForMember(d => d.FkColorsLeft, opt => opt.MapFrom(s => s.FkColorsLeft))
                    .ForMember(d => d.FkColorsRight, opt => opt.MapFrom(s => s.FkColorsRight));

                cfg.CreateMap<DB.PantsCuffType, API.PantsCuffType>()
                   .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                   .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.PantsType, API.PantsType>()
                   .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                   .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.Payment, API.Payment>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkPaymentMethods, opt => opt.MapFrom(s => s.FkPaymentMethods))
                    .ForMember(d => d.FkCurrencies, opt => opt.MapFrom(s => s.FkCurrencies))
                    .ForMember(d => d.FkPaymentStatuses, opt => opt.MapFrom(s => s.FkPaymentStatuses))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.PaymentDate, opt => opt.MapFrom(s => s.PaymentDate))
                    .ForMember(d => d.PaymentNumber, opt => opt.MapFrom(s => s.PaymentNumber));

                cfg.CreateMap<DB.PaymentMethod, API.PaymentMethod>()
                   .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                   .ForMember(d => d.Method, opt => opt.MapFrom(s => s.Method));

                cfg.CreateMap<DB.PaymentStatus, API.PaymentStatus>()
                  .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                  .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status));

                cfg.CreateMap<DB.Product, API.Product>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                    .ForMember(d => d.StockQuantity, opt => opt.MapFrom(s => s.StockQuantity))
                    .ForMember(d => d.IsActive, opt => opt.MapFrom(s => s.IsActive))
                    .ForMember(d => d.IsCustomizable, opt => opt.MapFrom(s => s.IsCustomizable))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<DB.ProductImage, API.ProductImage>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.ProductOrder, API.ProductOrder>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.FkCustomizableProducts, opt => opt.MapFrom(s => s.FkCustomizableProducts));

                cfg.CreateMap<DB.ProductTranslation, API.ProductTranslation>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<DB.Review, API.Review>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkProducts, opt => opt.MapFrom(s => s.FkProducts))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.Rating, opt => opt.MapFrom(s => s.Rating))
                    .ForMember(d => d.Comment, opt => opt.MapFrom(s => s.Comment))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt));

                cfg.CreateMap<DB.ShippingAdress, API.ShippingAdress>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkCountries, opt => opt.MapFrom(s => s.FkCountries))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince));

                cfg.CreateMap<DB.SizeOption, API.SizeOption>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Size, opt => opt.MapFrom(s => s.Size));

                cfg.CreateMap<DB.SleeveConstructor, API.SleeveConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSleeveTypes, opt => opt.MapFrom(s => s.FkSleeveTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<DB.SleeveCuffConstructor, API.SleeveCuffConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSleeveCuffTypes, opt => opt.MapFrom(s => s.FkSleeveCuffTypes))
                    .ForMember(d => d.FkColorsLeft, opt => opt.MapFrom(s => s.FkColorsLeft))
                    .ForMember(d => d.FkColorsRight, opt => opt.MapFrom(s => s.FkColorsRight));

                cfg.CreateMap<DB.SleeveCuffType, API.SleeveCuffType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.SleeveType, API.SleeveType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.SportSuitConstructor, API.SportSuitConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSweaterConstructor, opt => opt.MapFrom(s => s.FkSweaterConstructor))
                    .ForMember(d => d.FkSleeveConstructor, opt => opt.MapFrom(s => s.FkSleeveConstructor))
                    .ForMember(d => d.FkSleeveCuffConstructor, opt => opt.MapFrom(s => s.FkSleeveCuffConstructor))
                    .ForMember(d => d.FkBeltConstructor, opt => opt.MapFrom(s => s.FkBeltConstructor))
                    .ForMember(d => d.FkPantsConstructor, opt => opt.MapFrom(s => s.FkPantsConstructor))
                    .ForMember(d => d.FkPantsCuffConstructor, opt => opt.MapFrom(s => s.FkPantsCuffConstructor));

                cfg.CreateMap<DB.SweaterConstructor, API.SweaterConstructor>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkSweaterTypes, opt => opt.MapFrom(s => s.FkSweaterTypes))
                    .ForMember(d => d.FkColors, opt => opt.MapFrom(s => s.FkColors));

                cfg.CreateMap<DB.SweaterType, API.SweaterType>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.ImageData, opt => opt.MapFrom(s => s.ImageData));

                cfg.CreateMap<DB.User, API.User>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUserRoles, opt => opt.MapFrom(s => s.FkUserRoles))
                    .ForMember(d => d.Login, opt => opt.MapFrom(s => s.Login))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))
                    .ForMember(d => d.Password, opt => opt.MapFrom(s => s.Password))
                    .ForMember(d => d.ConfirmEmail, opt => opt.MapFrom(s => s.ConfirmEmail))
                    .ForMember(d => d.Hash, opt => opt.MapFrom(s => s.Hash))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<DB.UserProfile, API.UserProfile>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                    .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                    .ForMember(d => d.MiddleName, opt => opt.MapFrom(s => s.MiddleName))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince))
                    .ForMember(d => d.Country, opt => opt.MapFrom(s => s.Country))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Avatar, opt => opt.MapFrom(s => s.Avatar))
                    .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
                    .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

                cfg.CreateMap<DB.UserRole, API.UserRole>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkAccessLevels, opt => opt.MapFrom(s => s.FkAccessLevels))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                #endregion
            });

            return new Mapper(config);
        }
    }
}
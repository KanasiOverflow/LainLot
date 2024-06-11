using AutoMapper;
using DB = DatabaseProvider.Models;
using API = RestAPI.Models;

namespace RestAPI.AutoMapper
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
            //Provide all the Mapping Configuration
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AllowNullCollections = true;
                cfg.AddGlobalIgnore("Item");

                #region API -> DB

                //Configuring API to Database
                cfg.CreateMap<API.About, DB.About>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Header, opt => opt.MapFrom(s => s.Header))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<API.AccessLevel, DB.AccessLevel>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<API.Contact, DB.Contact>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email));

                cfg.CreateMap<API.Language, DB.Language>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.FullName))
                    .ForMember(d => d.Abbreviation, opt => opt.MapFrom(s => s.Abbreviation))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.DateFormat, opt => opt.MapFrom(s => s.DateFormat))
                    .ForMember(d => d.TimeFormat, opt => opt.MapFrom(s => s.TimeFormat));

                cfg.CreateMap<API.Post, DB.Post>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.PostDate, opt => opt.MapFrom(s => s.PostDate))
                    .ForMember(d => d.PostTime, opt => opt.MapFrom(s => s.PostTime))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text))
                    .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags))
                    .ForMember(d => d.Photo, opt => opt.MapFrom(s => s.Photo))
                    .ForMember(d => d.VisitCount, opt => opt.MapFrom(s => s.VisitCount));

                cfg.CreateMap<API.PostsTranslation, DB.PostsTranslation>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.FkPosts, opt => opt.MapFrom(s => s.FkPosts))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<API.User, DB.User>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUserRoles, opt => opt.MapFrom(s => s.FkUserRoles))
                    .ForMember(d => d.Login, opt => opt.MapFrom(s => s.Login))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))
                    .ForMember(d => d.Password, opt => opt.MapFrom(s => s.Password))
                    .ForMember(d => d.DateLink, opt => opt.MapFrom(s => s.DateLink))
                    .ForMember(d => d.TimeLink, opt => opt.MapFrom(s => s.TimeLink))
                    .ForMember(d => d.ConfirmEmail, opt => opt.MapFrom(s => s.ConfirmEmail))
                    .ForMember(d => d.Hash, opt => opt.MapFrom(s => s.Hash));

                cfg.CreateMap<API.UserProfile, DB.UserProfile>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDate))
                    .ForMember(d => d.CreateTime, opt => opt.MapFrom(s => s.CreateTime))
                    .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                    .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                    .ForMember(d => d.MiddleName, opt => opt.MapFrom(s => s.MiddleName))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince))
                    .ForMember(d => d.Country, opt => opt.MapFrom(s => s.Country))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Avatar, opt => opt.MapFrom(s => s.Avatar));

                cfg.CreateMap<API.UserRole, DB.UserRole>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkAccessLevels, opt => opt.MapFrom(s => s.FkAccessLevels))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                #endregion

                #region DB -> API

                //Configuring Database to API
                cfg.CreateMap<DB.About, API.About>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Header, opt => opt.MapFrom(s => s.Header))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<DB.AccessLevel, API.AccessLevel>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description));

                cfg.CreateMap<DB.Contact, API.Contact>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email));

                cfg.CreateMap<DB.Language, API.Language>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.FullName))
                    .ForMember(d => d.Abbreviation, opt => opt.MapFrom(s => s.Abbreviation))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.DateFormat, opt => opt.MapFrom(s => s.DateFormat))
                    .ForMember(d => d.TimeFormat, opt => opt.MapFrom(s => s.TimeFormat));

                cfg.CreateMap<DB.Post, API.Post>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.PostDate, opt => opt.MapFrom(s => s.PostDate))
                    .ForMember(d => d.PostTime, opt => opt.MapFrom(s => s.PostTime))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text))
                    .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags))
                    .ForMember(d => d.Photo, opt => opt.MapFrom(s => s.Photo))
                    .ForMember(d => d.VisitCount, opt => opt.MapFrom(s => s.VisitCount));

                cfg.CreateMap<DB.PostsTranslation, API.PostsTranslation>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkLanguages, opt => opt.MapFrom(s => s.FkLanguages))
                    .ForMember(d => d.FkPosts, opt => opt.MapFrom(s => s.FkPosts))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                    .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                    .ForMember(d => d.Text, opt => opt.MapFrom(s => s.Text));

                cfg.CreateMap<DB.User, API.User>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUserRoles, opt => opt.MapFrom(s => s.FkUserRoles))
                    .ForMember(d => d.Login, opt => opt.MapFrom(s => s.Login))
                    .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))
                    .ForMember(d => d.Password, opt => opt.MapFrom(s => s.Password))
                    .ForMember(d => d.DateLink, opt => opt.MapFrom(s => s.DateLink))
                    .ForMember(d => d.TimeLink, opt => opt.MapFrom(s => s.TimeLink))
                    .ForMember(d => d.ConfirmEmail, opt => opt.MapFrom(s => s.ConfirmEmail))
                    .ForMember(d => d.Hash, opt => opt.MapFrom(s => s.Hash));

                cfg.CreateMap<DB.UserProfile, API.UserProfile>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkUsers, opt => opt.MapFrom(s => s.FkUsers))
                    .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDate))
                    .ForMember(d => d.CreateTime, opt => opt.MapFrom(s => s.CreateTime))
                    .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                    .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                    .ForMember(d => d.MiddleName, opt => opt.MapFrom(s => s.MiddleName))
                    .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address))
                    .ForMember(d => d.City, opt => opt.MapFrom(s => s.City))
                    .ForMember(d => d.ZipPostCode, opt => opt.MapFrom(s => s.ZipPostCode))
                    .ForMember(d => d.StateProvince, opt => opt.MapFrom(s => s.StateProvince))
                    .ForMember(d => d.Country, opt => opt.MapFrom(s => s.Country))
                    .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone))
                    .ForMember(d => d.Avatar, opt => opt.MapFrom(s => s.Avatar));

                cfg.CreateMap<DB.UserRole, API.UserRole>()
                    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                    .ForMember(d => d.FkAccessLevels, opt => opt.MapFrom(s => s.FkAccessLevels))
                    .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name));

                #endregion
            });
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }
    }
}
using Newtonsoft.Json;
using DatabaseProvider.Models;
using DatabaseRepository.Classes;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authentication;
using RestAPI.Classes;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var LocalHostOrigins = "LocalHostOrigins";
var corsAdresses = new string[]
{
    "http://localhost:3000/",
    "http://localhost:8040/",
    "https://lainlot.com"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: LocalHostOrigins,
        policy =>
        {
            policy.WithOrigins(corsAdresses).AllowAnyHeader().AllowAnyMethod();
        });
});


var context = new LainLotContext();

builder.Services.AddDbContext<LainLotContext>();

// Add auth service
builder.Services.AddAuthentication("BasicAuthentication")
                .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
builder.Services.AddAuthorization();

builder.Services.AddSingleton<IRepository<About>>(new Repository<About>(context));
builder.Services.AddSingleton<IRepository<AccessLevel>>(new Repository<AccessLevel>(context));
builder.Services.AddSingleton<IRepository<Cart>>(new Repository<Cart>(context));
builder.Services.AddSingleton<IRepository<Category>>(new Repository<Category>(context));
builder.Services.AddSingleton<IRepository<CategoryHierarchy>>(new Repository<CategoryHierarchy>(context));
builder.Services.AddSingleton<IRepository<Color>>(new Repository<Color>(context));
builder.Services.AddSingleton<IRepository<Contact>>(new Repository<Contact>(context));
builder.Services.AddSingleton<IRepository<CustomizableProduct>>(new Repository<CustomizableProduct>(context));
builder.Services.AddSingleton<IRepository<CustomizationOrder>>(new Repository<CustomizationOrder>(context));
builder.Services.AddSingleton<IRepository<FabricType>>(new Repository<FabricType>(context));
builder.Services.AddSingleton<IRepository<Language>>(new Repository<Language>(context));
builder.Services.AddSingleton<IRepository<Order>>(new Repository<Order>(context));
builder.Services.AddSingleton<IRepository<OrderHistory>>(new Repository<OrderHistory>(context));
builder.Services.AddSingleton<IRepository<OrderStatus>>(new Repository<OrderStatus>(context));
builder.Services.AddSingleton<IRepository<Payment>>(new Repository<Payment>(context));
builder.Services.AddSingleton<IRepository<Product>>(new Repository<Product>(context));
builder.Services.AddSingleton<IRepository<ProductImage>>(new Repository<ProductImage>(context));
builder.Services.AddSingleton<IRepository<ProductTranslation>>(new Repository<ProductTranslation>(context));
builder.Services.AddSingleton<IRepository<Review>>(new Repository<Review>(context));
builder.Services.AddSingleton<IRepository<User>>(new Repository<User>(context));
builder.Services.AddSingleton<IRepository<UserProfile>>(new Repository<UserProfile>(context));
builder.Services.AddSingleton<IRepository<UserRole>>(new Repository<UserRole>(context));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(LocalHostOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
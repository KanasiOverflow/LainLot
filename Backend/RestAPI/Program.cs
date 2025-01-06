using Newtonsoft.Json;
using DatabaseProvider.Models;
using DatabaseRepository.Classes;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authentication;
using RestAPI.Classes;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var HostOrigins = "HostOrigins";
var corsAdresses = new string[]
{
    "http://localhost:3000",
    "http://localhost:8040",
    "https://lainlot.com"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: HostOrigins,
        policy =>
        {
            policy.WithOrigins(corsAdresses)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<LainLotContext>(options =>
    options.UseNpgsql(connectionString));

var logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
if (!Directory.Exists(logDirectory))
{
    Directory.CreateDirectory(logDirectory);
}

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddScoped<IRepository<About>, Repository<About>>();
builder.Services.AddScoped<IRepository<AccessLevel>, Repository<AccessLevel>>();
builder.Services.AddScoped<IRepository<Cart>, Repository<Cart>>();
builder.Services.AddScoped<IRepository<Category>, Repository<Category>>();
builder.Services.AddScoped<IRepository<CategoryHierarchy>, Repository<CategoryHierarchy>>();
builder.Services.AddScoped<IRepository<Color>, Repository<Color>>();
builder.Services.AddScoped<IRepository<Contact>, Repository<Contact>>();
builder.Services.AddScoped<IRepository<Country>, Repository<Country>>();
builder.Services.AddScoped<IRepository<Currency>, Repository<Currency>>();
builder.Services.AddScoped<IRepository<CustomizableProduct>, Repository<CustomizableProduct>>();
builder.Services.AddScoped<IRepository<FabricType>, Repository<FabricType>>();
builder.Services.AddScoped<IRepository<Language>, Repository<Language>>();
builder.Services.AddScoped<IRepository<Order>, Repository<Order>>();
builder.Services.AddScoped<IRepository<OrderHistory>, Repository<OrderHistory>>();
builder.Services.AddScoped<IRepository<OrderStatus>, Repository<OrderStatus>>();
builder.Services.AddScoped<IRepository<Payment>, Repository<Payment>>();
builder.Services.AddScoped<IRepository<PaymentMethod>, Repository<PaymentMethod>>();
builder.Services.AddScoped<IRepository<PaymentStatus>, Repository<PaymentStatus>>();
builder.Services.AddScoped<IRepository<Product>, Repository<Product>>();
builder.Services.AddScoped<IRepository<ProductImage>, Repository<ProductImage>>();
builder.Services.AddScoped<IRepository<ProductOrder>, Repository<ProductOrder>>();
builder.Services.AddScoped<IRepository<ProductTranslation>, Repository<ProductTranslation>>();
builder.Services.AddScoped<IRepository<Review>, Repository<Review>>();
builder.Services.AddScoped<IRepository<ShippingAdress>, Repository<ShippingAdress>>();
builder.Services.AddScoped<IRepository<SizeOption>, Repository<SizeOption>>();
builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IRepository<UserOrderHistory>, Repository<UserOrderHistory>>();
builder.Services.AddScoped<IRepository<UserProfile>, Repository<UserProfile>>();
builder.Services.AddScoped<IRepository<UserRole>, Repository<UserRole>>();

// Add auth service
builder.Services.AddAuthentication("BasicAuthentication")
                .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", (ILogger<Program> logger) =>
{
    logger.LogInformation("Hello from ASP.NET Core with Serilog!");
    return "Hello World!";
});

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(HostOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
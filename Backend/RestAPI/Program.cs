using Newtonsoft.Json;
using DatabaseProvider.Models;
using DatabaseRepository.Classes;
using DatabaseRepository.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using RestAPI.Classes;
using DatabaseProvider.Enums;
using Config;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var isDevelopment = string.Equals(Environment
    .GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), EnvVariables.Development.ToString(),
    StringComparison.InvariantCultureIgnoreCase);

var context = new LainLotContext();

builder.Services.AddDbContext<LainLotContext>(options =>
    options.UseNpgsql(isDevelopment ? ConnectionStrings.DEVConnectionString : ConnectionStrings.PRODConnectionString));

// Add auth service
builder.Services.AddAuthentication("BasicAuthentication")
                .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
builder.Services.AddAuthorization();

builder.Services.AddSingleton<IRepository<About>>(new Repository<About>(context));
builder.Services.AddSingleton<IRepository<AccessLevel>>(new Repository<AccessLevel>(context));
builder.Services.AddSingleton<IRepository<Contact>>(new Repository<Contact>(context));
builder.Services.AddSingleton<IRepository<Language>>(new Repository<Language>(context));
builder.Services.AddSingleton<IRepository<Post>>(new Repository<Post>(context));
builder.Services.AddSingleton<IRepository<PostsTranslation>>(new Repository<PostsTranslation>(context));
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

app.UseAuthentication();

app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.UseCors();

app.Run();
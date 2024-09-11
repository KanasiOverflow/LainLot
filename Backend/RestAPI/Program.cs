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

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
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

app.UseCors();

app.UseAuthorization();

app.UseAuthentication();

app.MapControllers();

app.Run();
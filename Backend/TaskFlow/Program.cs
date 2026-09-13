using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Text.Json.Serialization;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Middleware;
using TaskFlow.Services;
using TaskFlow.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ));
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IProjectPermissionService, ProjectPermissionService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<StagesService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"]!
            ))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://3zenyl3.github.io",
                    "http://135.106.210.189:3000"
                );
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ExceptionMiddleware>();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    
    app.UseHsts();
}
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();

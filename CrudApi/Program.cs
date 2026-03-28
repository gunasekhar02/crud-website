using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<CrudApi.Data.AppDbContext>(options =>
    options.UseSqlite("Data Source=crud.db"));

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CrudApi.Data.AppDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any())
    {
        db.Users.Add(new CrudApi.Models.User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password", workFactor: 12)
        });
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS BEFORE Authorization
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.Run();

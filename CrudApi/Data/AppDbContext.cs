using Microsoft.EntityFrameworkCore;
using CrudApi.Models;

namespace CrudApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Item> Items { get; set; } = null!;
    }
}
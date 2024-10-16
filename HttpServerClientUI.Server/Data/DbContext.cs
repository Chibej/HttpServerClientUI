using HttpServerClientUI.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace HttpServerClientUI.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<CanvasElement> CanvasElements { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

    }
}

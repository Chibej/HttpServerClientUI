using HttpServerClientUI.Server.Data;
using HttpServerClientUI.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HttpServerClientUI.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CanvasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CanvasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveCanvasElement(List<CanvasElement> elements)
        {
            foreach (var element in elements)
            {
                var existingElement = await _context.CanvasElements.FindAsync(element.Id);

                if (existingElement != null)
                {

                    existingElement.ElementType = element.ElementType;
                    existingElement.PositionX   = element.PositionX;
                    existingElement.PositionY   = element.PositionY;
                    existingElement.Address     = element.Address;
                    existingElement.Port        = element.Port;
                    existingElement.Request     = element.Request;
                    existingElement.Body        = element.Body;
                    existingElement.AdditionalSettings = element.AdditionalSettings;
                }
                else
                {
                    // Add a new element
                    _context.CanvasElements.Add(element);
                }
            }

            await _context.SaveChangesAsync();
            return Ok("Settings saved successfully!");
        }

        [HttpGet("load")]
        public async Task<IActionResult> LoadCanvasElements()
        {
            var elements = await _context.CanvasElements.ToListAsync();
            return Ok(elements); 
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCanvasElements()
        {
            _context.CanvasElements.RemoveRange(_context.CanvasElements); 
            await _context.SaveChangesAsync(); 
            return Ok("Canvas elements cleared.");
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using CrudApi.Data;
using CrudApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ItemsController(AppDbContext db)
        {
            _db = db;
        }

        private int? GetUserIdFromHeader()
        {
            if (Request.Headers.TryGetValue("X-UserId", out var id) && int.TryParse(id, out var userId))
            {
                return userId;
            }
            return null;
        }

        [HttpGet("getItems")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var userId = GetUserIdFromHeader();
            if (userId.HasValue)
            {
                return Ok(await _db.Items.Where(i => i.OwnerId == userId).ToListAsync());
            }
            return Ok(await _db.Items.ToListAsync());
        }

        [HttpGet("getItems/{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _db.Items.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("addItem")]
        public async Task<ActionResult<Item>> AddItem([FromBody] Item item)
        {
            var userId = GetUserIdFromHeader();
            item.OwnerId = userId;
            _db.Items.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
        }

        [HttpPut("editItem/{id}")]
        public async Task<IActionResult> EditItem(int id, [FromBody] Item updated)
        {
            var existing = await _db.Items.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Name = updated.Name;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _db.Items.FindAsync(id);
            if (item == null) return NotFound();
            _db.Items.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

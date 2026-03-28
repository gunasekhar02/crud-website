namespace CrudApi.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int? OwnerId { get; set; }
    }
}

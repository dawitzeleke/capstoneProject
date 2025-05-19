using backend.Domain.Common;


namespace backend.Domain.Entities
{
    public class Admin : User
    {
        public bool IsSuperAdmin { get; set; } = false;
    }
}

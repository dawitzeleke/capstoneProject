

using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Driver;

public class AdminRepository : GenericRepository<Admin>, IAdminRepository
{
    private readonly IMongoCollection<Admin> _admins;
    public AdminRepository(MongoDbContext context) : base(context)
    {
        _admins = context.GetCollection<Admin>(typeof(Admin).Name);
    }

    public async Task<Admin> GetByEmailAsync(string email)
    {
        return await _admins.Find(admin => admin.Email == email).FirstOrDefaultAsync();
    }
}
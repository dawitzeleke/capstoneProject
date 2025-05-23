

using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Bson;
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
    public async Task<Admin> GetByPhoneAsync(string phoneNumber)
    {
        return await _admins.Find(admin => admin.PhoneNumber == phoneNumber).FirstOrDefaultAsync();
    }
    public async Task<int> CountAsync()
    {
        return (int)await _admins.CountDocumentsAsync(new BsonDocument());
    }
    public async Task<Admin> GetByUserNameAsync(string userName)
    {
        var result = await _collection.Find(x => x.UserName == userName).FirstOrDefaultAsync();
        return result;
    }
}
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using Domain.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Persistence.Repositories;

public class TeacherRepository : GenericRepository<Teacher>, ITeacherRepository
{
    private readonly IMongoCollection<Teacher> _teachers;
    public TeacherRepository(MongoDbContext context) : base(context)
    {
        _teachers = context.GetCollection<Teacher>(typeof(Teacher).Name);
    }

    public async Task<Teacher> GetByEmailAsync(string email)
    {
        return await _teachers.Find(teacher => teacher.Email == email).FirstOrDefaultAsync();
    }

    public async Task<List<Teacher>> GetByIdsAsync(List<string> ids)
    {
        var filter = Builders<Teacher>.Filter.In(teacher => teacher.Id, ids);
        return await _teachers.Find(filter).ToListAsync();
    }

    public async Task<Teacher> GetByUserNameAsync(string userName)
    {
        var result = await _collection.Find(x => x.UserName == userName).FirstOrDefaultAsync();
        return result;
    }
    public async Task<Teacher> GetByPhoneAsync(string phoneNumber)
    {
        return await _teachers.Find(teacher => teacher.PhoneNumber == phoneNumber).FirstOrDefaultAsync();
    }
    public async Task<List<Teacher>> GetTeachersAsync(string? searchTerm, int pageNumber, int pageSize)
    {
        var filter = Builders<Teacher>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            filter = Builders<Teacher>.Filter.Or(
                Builders<Teacher>.Filter.Regex(t => t.FirstName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<Teacher>.Filter.Regex(t => t.LastName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<Teacher>.Filter.Regex(t => t.Email, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
        }

        return await _teachers
            .Find(filter)
            .SortBy(t => t.FirstName)
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }
    public async Task<int> CountAsync()
    {
        return (int)await _teachers.CountDocumentsAsync(new BsonDocument());
    }

}
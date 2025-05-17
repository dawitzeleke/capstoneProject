using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using MongoDB.Bson;
using MongoDB.Driver;
namespace backend.Persistence.Repositories;

public class StudentRepository : GenericRepository<Student>, IStudentRepository
{
    private readonly IMongoCollection<Student> _students;
    public StudentRepository(MongoDbContext dbContext) : base(dbContext)
    {
        _students = dbContext.GetCollection<Student>(typeof(Student).Name);
    }

    public async Task<Student> GetByEmailAsync(string email)
    {
        return await _students.Find(user => user.Email == email).FirstOrDefaultAsync();
    }
    public async Task<bool> UpdateAsync(Student student)
    {
        var result = await _students.ReplaceOneAsync(x => x.Id == student.Id, student);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }
    public async Task<Student> GetByUserNameAsync(string userName)
    {
        return await _students.Find(user => user.UserName == userName).FirstOrDefaultAsync();
    }
    public async Task<Student> GetByPhoneAsync(string phoneNumber)
    {
        return await _students.Find(user => user.PhoneNumber == phoneNumber).FirstOrDefaultAsync();
    }
    public async Task<List<Student>> GetStudentsAsync(string? searchTerm, int pageNumber, int pageSize)
    {
        var filter = Builders<Student>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            filter = Builders<Student>.Filter.Or(
                Builders<Student>.Filter.Regex(t => t.FirstName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<Student>.Filter.Regex(t => t.LastName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<Student>.Filter.Regex(t => t.Email, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
        }

        return await _students
            .Find(filter)
            .SortBy(t => t.FirstName)
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }
    
    public async Task<int> CountAsync()
    {
        return (int)await _students.CountDocumentsAsync(new BsonDocument());
    }
}
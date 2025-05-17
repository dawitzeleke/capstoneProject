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

    public async Task<int> CountAsync()
    {
        return (int)await _students.CountDocumentsAsync(new BsonDocument());
    }
}
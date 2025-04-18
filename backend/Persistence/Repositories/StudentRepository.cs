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
}
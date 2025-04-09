using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using Domain.Entities;
using MongoDB.Driver;

namespace backend.Persistence.Repositories;

public class TeacherRepository: GenericRepository<Teacher>, ITeacherRepository
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
}
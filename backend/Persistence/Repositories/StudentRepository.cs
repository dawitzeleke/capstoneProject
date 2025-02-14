namespace backend.Persistence.Repositories;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class StudentRepository : GenericRepository<Student>, IStudentRepository
{
    private readonly IMongoCollection<Student> _users;

    public StudentRepository(MongoDbContext context) : base(context)
    {
        _users = context.GetCollection<Student>(typeof(Student).Name);
    }

    public async Task<int> GetStudentGrade(int id)
    {
        var student = await _users.Find(x => x.Id == id).FirstOrDefaultAsync();
        return student.Grade;
    }

}
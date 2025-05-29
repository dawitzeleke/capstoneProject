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

    public async Task<bool> SaveQuestionAsync(string studentId, string questionId)
    {
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return false;

        if (student.SavedQuestions == null)
        {
            student.SavedQuestions = new HashSet<string>();
        }

        student.SavedQuestions.Add(questionId);
        await UpdateAsync(student);
        return true;
    }

    public async Task<bool> SaveContentAsync(string studentId, string contentId)
    {
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return false;

        if (student.SavedContents == null)
        {
            student.SavedContents = new HashSet<string>();
        }

        student.SavedContents.Add(contentId);
        await UpdateAsync(student);
        return true;
    }

    public async Task<IEnumerable<string>> GetSavedQuestions(string studentId)
    {
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return new HashSet<string>();

        return student.SavedQuestions ?? new HashSet<string>();
    }

    public async Task<bool> UpdateTotalPointsAsync(string studentId, int points)
    {
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return false;

        student.TotalPoints += points;
        var result = await _students.ReplaceOneAsync(x => x.Id == studentId, student);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }
}
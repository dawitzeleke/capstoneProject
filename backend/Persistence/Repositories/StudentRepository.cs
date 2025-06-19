using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using backend.Domain.Enums;
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

    public async Task<bool> UpdateStudentDivisionAsync(string studentId, DivisionEnums division)
    {
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return false;

        student.Division = division;
        var result = await _students.ReplaceOneAsync(x => x.Id == studentId, student);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<int> GetStudentRankAsync(string studentId)
    {
        //  check if student exists
        var student = await _students.Find(x => x.Id == studentId).FirstOrDefaultAsync();
        if (student == null) return 0;
        // Get all students, sort by TotalPoints, and find the rank of the specified student
        var count = await _students.CountDocumentsAsync(s => s.TotalPoints > student.TotalPoints);
        return (int)count + 1; // +1 to convert count to rank
    }


    public async Task<Dictionary<DivisionEnums, List<Student>>> GetLeaderStudentsAsync(int topCount)
    {
        var topStudentsByDivision = new Dictionary<DivisionEnums, List<Student>>();

        // Get all possible enum values for Division
        var divisions = Enum.GetValues(typeof(DivisionEnums)).Cast<DivisionEnums>();

        foreach (var division in divisions)
        {
            var filter = Builders<Student>.Filter.Eq(s => s.Division, division);
            var studentsInDivision = await _students.Find(filter)
                .SortByDescending(s => s.TotalPoints)
                .Limit(topCount)
                .ToListAsync();

            topStudentsByDivision.Add(division, studentsInDivision);
        }

        return topStudentsByDivision;
    }

    public async Task<List<Student>> GetStudentByIdListAsync(List<string> ids)
    {
        if (ids == null || !ids.Any())
        {
            return new List<Student>();
        }

        var filter = Builders<Student>.Filter.In(s => s.Id, ids);
        return await _students.Find(filter).ToListAsync();
    }
}
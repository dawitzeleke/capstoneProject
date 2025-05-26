using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IStudentRepository : IGenericRepository<Student>
{
    Task<Student> GetByEmailAsync(string email);
    Task<bool> UpdateAsync(Student student);
    Task<Student> GetByUserNameAsync(string userName);
    Task<Student> GetByPhoneAsync(string phoneNumber);
    Task<List<Student>> GetStudentsAsync(string? searchTerm, int pageNumber, int pageSize);
    Task<int> CountAsync();
    Task<bool> SaveQuestionAsync(string studentId, string questionId);
    Task<bool> SaveContentAsync(string studentId, string contentId);
    Task<IEnumerable<string>> GetSavedQuestions(string studentId);
}
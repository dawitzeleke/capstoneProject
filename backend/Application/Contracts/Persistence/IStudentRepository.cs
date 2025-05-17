using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IStudentRepository : IGenericRepository<Student>
{
    Task<Student> GetByEmailAsync(string email);
    Task<bool> UpdateAsync(Student student);
    Task<Student> GetByUserNameAsync(string userName);
    Task<Student> GetByPhoneAsync(string phoneNumber);
}
using Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface ITeacherRepository : IGenericRepository<Teacher>
{
    Task<Teacher> GetByEmailAsync(string email);
    Task<List<Teacher>> GetByIdsAsync(List<string> ids);
    Task<Teacher> GetByUserNameAsync(string userName);
    Task<Teacher> GetByPhoneAsync(string phoneNumber);
    Task<List<Teacher>> GetTeacherByNameAsync(string? firstName, string? lastName, int pageNumber = 1, int pageSize = 10);
    Task<List<Teacher>> GetTeachersAsync(string? searchTerm, int pageNumber, int pageSize);
    Task<int> CountAsync();

}
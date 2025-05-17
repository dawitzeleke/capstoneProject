using Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface ITeacherRepository : IGenericRepository<Teacher>
{
    Task<Teacher> GetByEmailAsync(string email);
    Task<List<Teacher>> GetByIdsAsync(List<string> ids);
    Task<Teacher> GetByUserNameAsync(string userName);
    Task<Teacher> GetByPhoneAsync(string phoneNumber);
    Task<List<Teacher>> GetTeachersAsync(string? searchTerm, int pageNumber, int pageSize);

}
using Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface ITeacherRepository : IGenericRepository<Teacher>
{
    Task<Teacher> GetByEmailAsync(string email);
    Task<List<Teacher>> GetByIdsAsync(List<string> ids);
    
}
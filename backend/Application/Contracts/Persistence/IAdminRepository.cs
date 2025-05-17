using backend.Domain.Entities;
using Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IAdminRepository : IGenericRepository<Admin>
{
    Task<Admin> GetByEmailAsync(string email);
    Task<Admin> GetByPhoneAsync(string phoneNumber);
    Task<int> CountAsync();
}
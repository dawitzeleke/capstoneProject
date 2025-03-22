using backend.Application.Contracts.Persistence;
using backend.Domain.Common;

namespace Application.Contracts.Persistence
{
    public interface IUserRepository: IGenericRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(string id);
    }
}

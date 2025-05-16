namespace backend.Application.Contracts.Persistence;

public interface IGenericRepository<T> where T : class
{
    Task<T> GetByIdAsync(string id);
    Task<IReadOnlyList<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(T entity);
}
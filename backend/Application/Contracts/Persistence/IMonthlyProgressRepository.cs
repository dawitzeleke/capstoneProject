using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IMonthlyProgressRepository : IGenericRepository<MonthlyProgress>
{
    public Task<MonthlyProgress> GetByStudentIdAsync(string studentId);
    public Task<MonthlyProgress> GetByStudentIdAndMonthAsync(string studentId, string monthYear);
    
}
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Contracts.Persistence;

public interface IStudentProgressRepository : IGenericRepository<StudentProgress>
{
    Task<StudentProgress> GetStudentProgress(string studentId);
    
}
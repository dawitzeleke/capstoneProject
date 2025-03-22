using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IStudentRepository:IGenericRepository<Student>{
    Task<Student> GetByEmailAsync(string email);
    
}
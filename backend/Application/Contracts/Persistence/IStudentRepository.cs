using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IStudentRepository:IGenericRepository<Student>{
    Task<int> GetStudentGrade(int id);
}
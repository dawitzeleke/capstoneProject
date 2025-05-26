using MediatR;
using backend.Application.Dtos.StudentDtos;

namespace backend.Application.Features.Students.Queries.GetStudentPerformance;

public class GetStudentPerformanceQuery : IRequest<List<StudentPerformanceDto>>
{
}

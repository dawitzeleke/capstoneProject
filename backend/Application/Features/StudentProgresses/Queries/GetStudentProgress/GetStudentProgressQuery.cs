using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.StudentProgresses.Queries.GetStudentProgress;

public class GetStudentProgressQuery : IRequest<List<object>>
{
    public string StudentId { get; set; }
}
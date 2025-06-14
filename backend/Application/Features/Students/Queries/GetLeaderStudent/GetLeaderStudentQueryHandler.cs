using MediatR;
using backend.Domain.Enums;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;


namespace backend.Application.Features.Students.Queries.GetLeaderStudent;

public class GetLeaderStudentsQueryHandler : IRequestHandler<GetLeaderStudentsQuery, List<Student>>
{
    private readonly IStudentRepository _studentRepository;

    public GetLeaderStudentsQueryHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<List<Student>> Handle(GetLeaderStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _studentRepository.GetLeaderStudentsAsync(request.Division, request.TopCount);
        return students;       
    }
}
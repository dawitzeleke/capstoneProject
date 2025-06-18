using MediatR;
using backend.Domain.Enums;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;


namespace backend.Application.Features.Students.Queries.GetLeaderStudent;

public class GetLeaderStudentsQueryHandler : IRequestHandler<GetLeaderStudentsQuery, Dictionary<DivisionEnums, List<Student>>>
{
    private readonly IStudentRepository _studentRepository;

    public GetLeaderStudentsQueryHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<Dictionary<DivisionEnums, List<Student>>> Handle(GetLeaderStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _studentRepository.GetLeaderStudentsAsync(request.TopCount);
        return students;       
    }
}
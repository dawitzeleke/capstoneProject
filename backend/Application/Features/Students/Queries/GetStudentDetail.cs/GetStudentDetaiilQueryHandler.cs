namespace backend.Application.Features.Students.Queries.GetStudentDetail;

using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;

public class GetStudentDetailQueryHandler : IRequestHandler<GetStudentDetailQuery, Student>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentDetailQueryHandler(IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Student> Handle(GetStudentDetailQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(studentId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var student = await _studentRepository.GetByIdAsync(studentId);
        if (student == null)
        {
            throw new Exception("Student not found.");
        }

        return student;
    }
}
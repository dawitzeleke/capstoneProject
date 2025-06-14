using MediatR;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Students.Queries.GetStudentRank;

public class GetStudentRankQueryHandler : IRequestHandler<GetStudentRankQuery,int>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentRankQueryHandler(IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(GetStudentRankQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(studentId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        var rank = await _studentRepository.GetStudentRankAsync(studentId);
        if (rank == null)
        {
            throw new Exception("Rank not found for the student.");
        }
        return rank;
    }
}
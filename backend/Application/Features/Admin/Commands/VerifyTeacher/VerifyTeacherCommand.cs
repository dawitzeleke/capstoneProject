using MediatR;

public class VerifyTeacherCommand : IRequest<VerifyTeacherResponseDto>
{
    public string TeacherId { get; set; }
}

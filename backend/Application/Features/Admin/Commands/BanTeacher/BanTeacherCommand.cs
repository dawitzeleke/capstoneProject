using MediatR;

public class BanTeacherCommand : IRequest<BanTeacherDto>
{
    public string TeacherId { get; set; }
    public string Reason { get; set; }
    public DateTime? BannedUntil { get; set; }

}
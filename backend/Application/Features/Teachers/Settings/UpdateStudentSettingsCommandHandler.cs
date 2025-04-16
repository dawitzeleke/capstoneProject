using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;

public class UpdateTeacherSettingsCommandHandler : IRequestHandler<UpdateTeacherSettingsCommand, bool>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IMapper _mapper;

    public UpdateTeacherSettingsCommandHandler(IStudentRepository studentRepository, IMapper mapper)
    {
        _studentRepository = studentRepository;
        _mapper = mapper;
    }

    public async Task<bool> Handle(UpdateStudentSettingsCommand request, CancellationToken cancellationToken)
    {
        var student = await _studentRepository.GetByEmailAsync(request.Email);
        if (student == null) return false;

        var updatedStudent = _mapper.Map(request, student);
        updatedStudent.Id = student.Id;

        return await _studentRepository.UpdateAsync(updatedStudent);
    }
}
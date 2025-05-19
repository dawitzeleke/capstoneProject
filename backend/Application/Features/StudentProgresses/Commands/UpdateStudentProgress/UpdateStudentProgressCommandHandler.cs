using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;


namespace backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;

public class UpdateStudentProgressCommandHandler : IRequestHandler<UpdateStudentProgressCommand,bool>
{
    private readonly IStudentProgressRepository _studentProgressRepository;
    private readonly IMonthlyProgressRepository _monthlyProgressRepository;

    public UpdateStudentProgressCommandHandler(IStudentProgressRepository studentProgressRepository, IMonthlyProgressRepository monthlyProgress)
    {
        _studentProgressRepository = studentProgressRepository;
        _monthlyProgressRepository = monthlyProgress;
        
    }

    public async Task<bool> Handle(UpdateStudentProgressCommand request, CancellationToken cancellationToken)
    {
        var studentProgress = await _studentProgressRepository.GetStudentProgress(request.StudentId);
        var month_year = DateTime.Now.ToString("MMMM yyyy");
        var day = DateTime.Now.Day-1;
        // check if student progress exists
        // if not, create a new one
        if (studentProgress == null)
        {
           
            var newStudentProgress = new StudentProgress
            {
                StudentId = request.StudentId,
                Progresses = new Dictionary<string,string>()
            };
            studentProgress = await _studentProgressRepository.CreateAsync(newStudentProgress);
            
        }

        
        // check if the month exists in the student progress
        // if it does, update the progress
        // if it doesn't, create a new progress
        if(studentProgress.Progresses.ContainsKey(month_year))
        {
            var progressId = studentProgress.Progresses[month_year];
            var progress = await _monthlyProgressRepository.GetByIdAsync(progressId);
            if (progress == null)
            {
                return false;
            }
            // update the day's progress
            progress.Questions[day].UnionWith(request.Questions);
            var response = await _monthlyProgressRepository.UpdateAsync(progress);
            if (response == null)
            {;
                return false;
            }
            return true;
        }else{
            var monthly_progress = new MonthlyProgress(month_year);
            monthly_progress.Questions[day].UnionWith(request.Questions);
            var new_month_progress  = await _monthlyProgressRepository.CreateAsync(monthly_progress);
            if(new_month_progress == null)
            {
                return false;
            }
            // add new progress to student progress
            studentProgress.Progresses.Add(month_year, new_month_progress.Id);
            var response = await _studentProgressRepository.UpdateAsync(studentProgress);
            if (response!=null)
            {
                return false;
            }
            return true;
        }
        return false;
    }
}
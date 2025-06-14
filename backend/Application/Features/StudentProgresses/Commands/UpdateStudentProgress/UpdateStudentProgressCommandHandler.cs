using MediatR;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;


namespace backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;

public class UpdateStudentProgressCommandHandler : IRequestHandler<UpdateStudentProgressCommand,bool>
{
    private readonly IStudentProgressRepository _studentProgressRepository;
    private readonly IMonthlyProgressRepository _monthlyProgressRepository;
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly IStudentQuestionAttemptsRepository _studentQuestionAttemptsRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentRepository _studentRepository;

    public UpdateStudentProgressCommandHandler(IStudentProgressRepository studentProgressRepository, IMonthlyProgressRepository monthlyProgress,
        IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository, IStudentQuestionAttemptsRepository studentQuestionAttemptsRepository, 
        ICurrentUserService currentUserService, IQuestionRepository questionRepository, IStudentRepository studentRepository)
    {
        _studentProgressRepository = studentProgressRepository;
        _monthlyProgressRepository = monthlyProgress;
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _studentQuestionAttemptsRepository = studentQuestionAttemptsRepository;
        _currentUserService = currentUserService;
        _questionRepository = questionRepository;
        _studentRepository = studentRepository;
    }

    public async Task<bool> Handle(UpdateStudentProgressCommand request, CancellationToken cancellationToken)
    {
        // check if student progress exists
        // if not, create a new one
        var student_id = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(student_id))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        
        var studentProgress = await _studentProgressRepository.GetStudentProgress(student_id);
        var month_year = DateTime.Now.ToString("MMMM yyyy");
        var day = DateTime.Now.Day-1;
        
        if (studentProgress == null)
        {
           
            var newStudentProgress = new StudentProgress
            {
                StudentId = student_id,
                Progresses = new Dictionary<string,string>()
            };
            studentProgress = await _studentProgressRepository.CreateAsync(newStudentProgress);
            
        }
        var update_response = updateSolvedAttemptedQuestions(request);
        if (update_response == null)
        {
            return false;
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
            progress.Questions[day].UnionWith(request.CorrectQuestions);
            var response = await _monthlyProgressRepository.UpdateAsync(progress);
            if (response == null)
            { 
                return false;
            }

            return true;
        }else{
            var monthly_progress = new MonthlyProgress(month_year);
            monthly_progress.StudentId = student_id;
            monthly_progress.Questions[day].UnionWith(request.CorrectQuestions);
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
                return true;
            }
            return false;
        }
        return false;
    }

    public async Task<bool> updateSolvedAttemptedQuestions(UpdateStudentProgressCommand request)
    {
        var totalPoints = 0;
        var studentId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(studentId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        // Get the previously solved questionIds and attempted questionIds for the student
        var previous_solved_question_Ids = await _studentSolvedQuestionsRepository.GetSolvedQuestionIds(new QuestionFilterDto
        {
            StudentId = studentId
        });
        
        var previous_attempted_question_Ids = await _studentQuestionAttemptsRepository.GetAttemptedQuestionIds(new QuestionFilterDto
        {
            StudentId = studentId
        });

        // Get previously solvedQuestion entities for the student
        var solvedQuestions = await _studentSolvedQuestionsRepository.GetSolvedQuestions(studentId);
        // ## previously solved also currently solved questions
        var solvedToUpdate = solvedQuestions
            .Where(q => request.CorrectQuestions.Contains(q.QuestionId))
            .ToList(); 
        // send update request to => Increment solvecount
        var update_solved_result = await _studentSolvedQuestionsRepository.UpdateSolvedQuestions(solvedToUpdate, studentId, 1);
        if (update_solved_result == null)
        {
            return false;
        }
        
        // ## previously solved but currently attempted questions
         var previous_solved_current_attempted = solvedQuestions
            .Where(q => request.AttemptedQuestions.Contains(q.QuestionId))
            .ToList(); 

        // send update request to => decrement solveCount
        var update_solved_result2 = await _studentSolvedQuestionsRepository.UpdateSolvedQuestions(previous_solved_current_attempted, studentId, -1);
        if (update_solved_result2 == null)
        {
            return false;
        }

        // ## newly solved questionIds
        var new_solved_question_Ids = request.CorrectQuestions
            .Except(previous_solved_question_Ids)
            .ToList(); 
        // send create request to => create new SolvedQuestion
        // need to get the question metadata for the new solved questions
        //: Fetch questions from Question Repository 
        var solvedQuestionsMetadata = await _questionRepository.GetQuestionByIdList(new_solved_question_Ids); // returns List<Question>

        //: Convert to dictionary for efficient lookup
        var questionDict = solvedQuestionsMetadata.ToDictionary(q => q.Id, q => q);


        //  prepare SolvedQuestion entities to be inserted
        var newSolvedQuestions = new_solved_question_Ids
            .Select(qId => {
                var q = questionDict[qId];
                return new StudentSolvedQuestions
                {
                    QuestionId = qId,
                    StudentId = studentId,
                    SolveCount = 1,
                    CreatorId = q.CreatedBy,
                    CourseName = q.CourseName,
                    Chapter = q.Chapter,
                    LastAttempt = DateTime.UtcNow,
                    Grade = q.Grade,
                    Stream = q.Stream?? null,
                    Difficulty = q.Difficulty
                };
            })
            .ToList();
        // send create request to => create new SolvedQuestion
        var create_solved_response = await _studentSolvedQuestionsRepository.InsertManyAsync(newSolvedQuestions);
        if (create_solved_response == null)
        {
            return false;
        }

        // ## newly attempted questions
        var new_attempted_question_Ids = request.AttemptedQuestions
            .Except(previous_attempted_question_Ids)
            .ToList();
        
        var attemptedQuestionsMetadata = await _questionRepository.GetQuestionByIdList(new_attempted_question_Ids); // returns List<Question>

        //: Convert to dictionary for efficient lookup
        var questionDict2 = attemptedQuestionsMetadata.ToDictionary(q => q.Id, q => q);


        var newAttemptedQuestion = new_attempted_question_Ids
            .Select(qId => {
                var q = questionDict2[qId];
                return new StudentQuestionAttempts
                {
                    QuestionId = qId,
                    StudentId = studentId,
                    AttemptCount = 1,
                    CreatorId = q.CreatedBy,
                    CourseName = q.CourseName,
                    Chapter = q.Chapter,
                    LastAttempt = DateTime.UtcNow,
                    Grade = q.Grade,
                    Stream = q.Stream?? null,
                    Difficulty = q.Difficulty
                };
            })
            .ToList();

        // send create request to => create new AttemptedQuestion
        var create_attempted_response = await _studentQuestionAttemptsRepository.InsertManyAsync(newAttemptedQuestion);
        if (create_attempted_response != null)
        {

        }

        // previously attempted questions 
        var attemptedQuestions = await _studentQuestionAttemptsRepository.GetAttemptedQuestions(studentId);

        // ## previously attempted but currently solved questions
        var attemptedToRemove = attemptedQuestions
            .Where(q => request.CorrectQuestions.Contains(q.QuestionId))
            .ToList(); 
        //  send remove request to => remove from attempted questions
        await _studentQuestionAttemptsRepository.RemoveManyAsync(attemptedToRemove);
        

        // prepare list of previously attempted but currently solved questions as new solved questions
        var newSolvedFromAttempted = attemptedToRemove
            .Select(q => new StudentSolvedQuestions
            {
                QuestionId = q.QuestionId,
                StudentId = studentId,
                SolveCount = 1,
                CreatorId = q.CreatorId,
                CourseName = q.CourseName,
                Chapter = q.Chapter,
                LastAttempt = DateTime.UtcNow,
                Grade = q.Grade,
                Stream = q.Stream?? null,
                Difficulty = q.Difficulty
            })
            .ToList();
        // send create request to => create new SolvedQuestion from previously attempted questions
        var create_solved_from_attempted_response = await _studentSolvedQuestionsRepository.InsertManyAsync(newSolvedFromAttempted);
        // check if the create request was successful
        if (create_solved_from_attempted_response == null)
        {
        }
        

        // ## previously attempted also currently attempted questions
        var attemptedToUpdate = attemptedQuestions
            .Where(q => request.AttemptedQuestions.Contains(q.QuestionId))
            .ToList(); 
        // send update request to => Increment attemptCount++
        var update_result = await _studentQuestionAttemptsRepository.UpdateAttemptedQuestions(attemptedToUpdate, studentId, 1);
        if (update_result == null)
        {
        }
        string[] newSOlvedFromAttemptedIds = [];
        foreach(var question in newSolvedFromAttempted){
            newSOlvedFromAttemptedIds.Append(question.QuestionId);
            switch (question.Difficulty)
            {
                case DifficultyLevel.Easy:
                    totalPoints += 1;
                    break;
                case DifficultyLevel.Medium:
                    totalPoints += 2;
                    break;
                case DifficultyLevel.Hard:
                    totalPoints += 3;
                    break;
                default:
                    totalPoints += 0; // Default case if no match
                    break;
            }
            
        }

        foreach(var question in newSolvedQuestions)
        {
            switch (question.Difficulty)
            {
                case DifficultyLevel.Easy:
                    totalPoints += 1;
                    break;
                case DifficultyLevel.Medium:
                    totalPoints += 2;
                    break;
                case DifficultyLevel.Hard:
                    totalPoints += 3;
                    break;
                default:
                    totalPoints += 0; // Default case if no match
                    break;
            }
        }
        // Update the student's total points in the student progress
        var response = await _studentRepository.UpdateTotalPointsAsync(studentId, totalPoints);
        if (response == null)
        {
        }

        // update the question's total correct answers
        var questionIds = new_solved_question_Ids.Union(newSOlvedFromAttemptedIds).ToList();
        var updateQuestionResponse = await _questionRepository.UpdateTotalCorrectAnswers(questionIds, 1);
        return true;
    }
}
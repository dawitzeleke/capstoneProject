using MediatR;

namespace backend.Application.Features.Students.Commands.SaveQuestion;
public class SaveQuestionCommand : IRequest<bool>
{
    public string QuestionId { get; set; }
}


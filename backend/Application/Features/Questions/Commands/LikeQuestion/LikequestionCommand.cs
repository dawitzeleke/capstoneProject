using MediatR;
namespace backend.Application.Features.Questions.Commands.LikeQuestion;
public class LikeQuestionCommand : IRequest<bool>
{
    public string QuestionId { get; set; }
    public string UserId { get; set; }

    public LikeQuestionCommand(string questionId)
    {
        QuestionId = questionId;
    }
}
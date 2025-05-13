using MediatR;

namespace backend.Application.Features.Questions.Commands.DeleteQuestion;

public class DeleteQuestionCommand : IRequest<bool>
{
    public string Id { get; set; }
}
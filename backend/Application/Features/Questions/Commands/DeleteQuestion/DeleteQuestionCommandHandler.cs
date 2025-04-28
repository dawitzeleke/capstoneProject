using MediatR;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Commands.DeleteQuestion;

public class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommand,bool>
{
    private readonly IQuestionRepository _questionRepository;

    public DeleteQuestionCommandHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }
    public async Task<bool> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
    {
        var questionToDelete = await _questionRepository.GetByIdAsync(request.Id);
        if (questionToDelete == null)
        {
            return false;
        }
        var response=await _questionRepository.DeleteAsync(questionToDelete);
        return response;
    }
}
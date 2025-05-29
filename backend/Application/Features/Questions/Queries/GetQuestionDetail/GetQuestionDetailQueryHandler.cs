using MediatR;
using System.Threading;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Queries.GetQuestionDetail;
public class GetQuestionDetailQueryHandler: IRequestHandler<GetQuestionDetailQuery, Question>
{
    private readonly IQuestionRepository _questionRepository;

    public GetQuestionDetailQueryHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<Question> Handle(GetQuestionDetailQuery request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Id);
        if (question == null)
        {
            // throw new NotFoundException(nameof(Question), request.Id);
            return null;
        }
        return question;
    }   
}
using MediatR;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Queries.GetQuestionDetail;

public class GetQuestionDetailQuery : IRequest<GetQuestionDetailDto>
{
    public string Id { get; set; }
}
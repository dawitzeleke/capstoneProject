using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Queries.GetQuestionDetail;

public class GetQuestionDetailQuery : IRequest<Question>
{
    public string Id { get; set; }
}
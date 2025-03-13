using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQuery : IRequest<List<GetQuestionDetailDto>>
{
    
}
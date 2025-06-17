using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Features.Questions.Queries.GetTeachersQuestion;

public class GetTeachersPostedQuestionQuery : IRequest<List<Question>>
{
    
}
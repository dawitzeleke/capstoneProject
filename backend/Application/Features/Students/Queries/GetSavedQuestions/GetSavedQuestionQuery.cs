using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.Students.Queries.GetSavedQuestions;

public class GetSavedQuestionsQuery : IRequest<List<Question>>
{
}
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Features.Teachers.Queries.GetFollower;

public class GetFollowerQuery: IRequest<List<Student>>
{
}
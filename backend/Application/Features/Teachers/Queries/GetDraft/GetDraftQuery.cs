using MediatR;
using backend.Domain.Enums;

namespace backend.Application.Features.Teachers.Queries.GetDraft;

public class GetDraftQuery: IRequest<List<object>>
{
    public ContentTypeEnum contentType { get; set;} 
    public int totalCount { get; set; }
}
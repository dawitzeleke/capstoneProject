using MediatR;
using backend.Domain.Entities;
namespace backend.Application.Contracts.Persistence;


public interface IImageContentRepository : IGenericRepository<ImageContent>
{
    // Task<bool> AddTagToImageContent(string id, string[] newTags);
    // Task<bool> AddImageView(string id);
}
using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.PaginationDtos;
using backend.Application.Dtos.ImageContentDtos;
namespace backend.Application.Contracts.Persistence;


public interface IImageContentRepository : IGenericRepository<ImageContent>
{
    Task<List<ImageContent>> GetImageContentByIdList(IEnumerable<string> imageId);
    // Task<bool> AddTagToImageContent(string id, string[] newTags);
    // Task<bool> AddImageView(string id);
    Task<List<ImageContent>> GetFilteredImageContents(ImageContentFilterDto filter, PaginationDto pagination);
}
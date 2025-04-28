using backend.Application.Dtos.CloudinaryDtos;

namespace backend.Application.Contracts.Services;

public interface ICloudinaryService
{
    Task<UploadResponse> UploadImageAsync(Stream image);
    Task<UploadResponse> UploadVideoAsync(Stream video);
    Task<bool> Delete(string publicId);

}
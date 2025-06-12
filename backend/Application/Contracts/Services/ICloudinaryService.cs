using backend.Application.Dtos.CloudinaryDtos;
using Microsoft.AspNetCore.Http;

namespace backend.Application.Contracts.Services;
public interface ICloudinaryService
{
    Task<UploadResponse> UploadImageAsync(Stream image);
    Task<UploadResponse> UploadFileAsync(IFormFile file, string folder);
    Task<UploadResponse> UploadVideoAsync(Stream video);
    Task<bool> Delete(string publicId);

    // Task<UploadResponse> UpdateFileAsync(IFormFile file, string publicId);

}
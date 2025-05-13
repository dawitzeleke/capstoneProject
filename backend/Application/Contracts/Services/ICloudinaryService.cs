using backend.Application.Dtos.CloudinaryDtos;

namespace backend.Application.Contracts.Services;
using Microsoft.AspNetCore.Http;
public interface ICloudinaryService
{
    Task<UploadResponse> UploadImageAsync(Stream image);
    Task<UploadResponse> UploadFileAsync(IFormFile file, string folder);
    Task<UploadResponse> UploadVideoAsync(Stream video);
    Task<bool> Delete(string publicId);

    Task<UploadResponse> UpdateFileAsync(IFormFile file, string publicId);

}
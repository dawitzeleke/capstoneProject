using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using backend.Application.Dtos.CloudinaryDtos;
using backend.Application.Contracts.Services;
using Microsoft.AspNetCore.Http;

namespace backend.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    public CloudinaryService(string cloud_name, string api_key, string api_secret)
    {
        var account = new Account(cloud_name, api_key, api_secret);
        _cloudinary = new Cloudinary(account);
    }


    public async Task<UploadResponse> UploadImageAsync(Stream image)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription("image", image),
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        var response = new UploadResponse
        {
            Url = uploadResult.Url.ToString(),
            PublicId = uploadResult.PublicId
        };

        return response;
    }
    public async Task<bool> Delete(string publicId)
    {
        var deletionParams = new DeletionParams(publicId)
        {
            ResourceType = ResourceType.Raw 
        };

        var result = await _cloudinary.DestroyAsync(deletionParams);
        Console.WriteLine($"Cloudinary delete result: {result.Result} for {publicId}");

        return result.Result == "ok" || result.Result == "not found";
    }


    public async Task<UploadResponse> UploadVideoAsync(Stream video)
    {
        var uploadParams = new VideoUploadParams
        {
            File = new FileDescription("video", video),

        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        var response = new UploadResponse
        {
            Url = uploadResult.Url.ToString(),
            PublicId = uploadResult.PublicId,
        };
        return response;
    }

    public async Task<UploadResponse> UploadFileAsync(IFormFile file, string folder)
    {
        var uploadParams = new RawUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = folder,
            PublicId = file.FileName,
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        var response = new UploadResponse
        {
            Url = uploadResult.Url.ToString(),
            PublicId = uploadResult.PublicId,
        };
        return response;
    }
    // public async Task<UploadResponse> UpdateFileAsync(IFormFile file, string publicId)
    // {
    //     var uploadParams = new RawUploadParams
    //     {
    //         File = new FileDescription(file.FileName, file.OpenReadStream()),
    //         PublicId = publicId,
    //     };

    //     var uploadResult = await _cloudinary.UploadAsync(uploadParams);

    //     var response = new UploadResponse
    //     {
    //         Url = uploadResult.Url.ToString(),
    //         PublicId = uploadResult.PublicId,
    //     };
    //     return response;
    // }

}
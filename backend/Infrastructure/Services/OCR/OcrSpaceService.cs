using backend.Application.Contracts.Services;
using System.Net.Http.Headers;
using System.Text.Json;

namespace backend.Infrastructure.Services;
public class OcrSpaceService : IOcrService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OcrSpaceService(HttpClient httpClient, string api_key)
    {
        _httpClient = httpClient;
        _apiKey = api_key;
    }

    public async Task<string> ExtractTextAsync(Stream imageStream)
    {
        using var content = new MultipartFormDataContent();
        const string ocrUrl = "https://api.ocr.space/parse/image";

        var imageContent = new StreamContent(imageStream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        content.Add(imageContent, "file", "image.png");
        content.Add(new StringContent("eng"), "language");
        content.Add(new StringContent("true"), "isOverlayRequired");

        var request = new HttpRequestMessage(HttpMethod.Post, ocrUrl)
        {
            Headers = { { "apikey", _apiKey } },
            Content = content
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var resultString = await response.Content.ReadAsStringAsync();
        var resultJson = JsonSerializer.Deserialize<OcrResult>(resultString);

        return resultJson?.ParsedResults?.FirstOrDefault()?.ParsedText ?? string.Empty;
    
    }

    // Helper classes for JSON deserialization
    private class OcrResult
    {
        public List<ParsedResult> ParsedResults { get; set; }
    }

    private class ParsedResult
    {
        public string ParsedText { get; set; }
    }
}
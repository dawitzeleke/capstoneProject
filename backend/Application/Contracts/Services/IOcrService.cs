
namespace backend.Application.Contracts.Services;
public interface IOcrService
{
    Task<string> ExtractTextAsync(Stream imageStream);
}
 
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using backend.Application.Contracts.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string UserId => 
        _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    public string Role => 
        _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value 
        ?? throw new UnauthorizedAccessException("User role is missing.");
}

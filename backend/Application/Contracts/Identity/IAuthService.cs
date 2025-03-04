using System.Threading.Tasks;
using backend.Application.Features.Identity.DTOs;

namespace backend.Application.Contracts.Identity
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterUserDto request);
        Task<AuthResponseDto> LoginAsync(LoginUserDto request);
    }
}

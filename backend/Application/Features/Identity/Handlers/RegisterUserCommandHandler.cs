using System.Threading;
using System.Threading.Tasks;
using backend.Application.Contracts.Identity;
using backend.Application.Features.Identity.Commands;
using backend.Application.Features.Identity.DTOs;
using MediatR;

namespace backend.Application.Features.Identity.Handlers
{
    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, AuthResponseDto>
    {
        private readonly IAuthService _authService;

        public RegisterUserHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(request);
        }
    }
}

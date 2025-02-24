using Domain.Entities;
using Domain.Interfaces;

public class GetUserByEmailQuery : IRequest<User?>
{
    public string Email { get; set; }
}

public class GetUserByEmailHandler : IRequestHandler<GetUserByEmailQuery, User?>
{
    private readonly IUserRepository _userRepository;

    public GetUserByEmailHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        return await _userRepository.GetByEmailAsync(request.Email);
    }
}

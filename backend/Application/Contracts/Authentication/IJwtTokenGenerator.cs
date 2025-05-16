public interface IJwtTokenGenerator
{
    string GenerateToken(string userId, string email);
    string GeneratePasswordSetupToken(string userId, string email);
}

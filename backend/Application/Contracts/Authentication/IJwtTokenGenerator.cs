public interface IJwtTokenGenerator
{
    string GenerateToken(string userId, string email, string role);
    string GeneratePasswordSetupToken(string userId, string email);
}

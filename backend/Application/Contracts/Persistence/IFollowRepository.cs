using backend.Application.Contracts.Persistence;

public interface IFollowRepository : IGenericRepository<Follow>
{
    Task<bool> IsFollowing(string studentId, string teacherId);
    Task<bool> UnFollow(string studentId, string teacherId);

    Task<List<Follow>> GetByStudentIdAsync(string studentId);
    Task<List<string>> GetFollowersAsync(string teacherId);

}
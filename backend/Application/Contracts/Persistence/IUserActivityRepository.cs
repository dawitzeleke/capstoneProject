public interface IUserActivityRepository
{
    Task TrackAsync(string userId, string role);
    Task<int> CountActiveUsersTodayAsync();
}

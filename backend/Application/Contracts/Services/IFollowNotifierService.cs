namespace backend.Application.Contracts.Services;

public interface IFollowNotifierService
{
    Task NotifyFollowAsync(string followerId, string followedId);
    Task NotifyUnfollowAsync(string followerId, string followedId);
    Task NotifyFollowersAsync(string followedId, string message);    
}
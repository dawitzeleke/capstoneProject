public class AdminProfileDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string ProfilePictureUrl { get; set; }
    public string ProfilePicturePublicId { get; set; }
    public List<string> VerifiedTeacherIds { get; set; }
    public List<string> BannedUserIds { get; set; }
    public List<string> RemovedContentIds { get; set; }

    public int TotalModerationActions { get; set; }
    public DateTime RegistrationDate { get; set; }

    // public Settings Preferences { get; set; }
}

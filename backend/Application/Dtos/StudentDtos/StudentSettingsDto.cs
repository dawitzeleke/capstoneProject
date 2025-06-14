public class StudentSettingsDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string ProfilePictureUrl { get; set; }
    public string ProgressLevel { get; set; }
    public List<string> CompletedQuestions { get; set; }
    public List<string> Badges { get; set; }
    public int Grade { get; set; }
    public string School { get; set; }
    public int FollowingCount { get; set; }
    public int SavedQuestionsCount { get; set; }
    public int Points { get; set; }
    public int Leaderborad { get; set; }
    public int QuestionsDone { get; set; }
    public int ActiveDays { get; set; }
}
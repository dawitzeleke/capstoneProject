public class StudentDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string UserName { get; set; }
    public string ProfilePictureUrl { get; set; }
    public string ProgressLevel { get; set; }
    public List<string> CompletedQuestions { get; set; } = new();
    public List<string> Badges { get; set; } = new();
    public int Grade { get; set; }
}
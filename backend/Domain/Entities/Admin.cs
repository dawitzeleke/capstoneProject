using backend.Domain.Common;


namespace backend.Domain.Entities
{
    public class Admin : User
    {
        public bool IsSuperAdmin { get; set; } = false;
        public List<string> VerifiedTeacherIds { get; set; } = new List<string>();
        public List<string> BannedUserIds { get; set; } = new List<string>();
        public List<string> RemovedContentIds { get; set; } = new List<string>();
        public int TotalModerationActions { get; set; } = 0;
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        // public Settings Preferences { get; set; } = new Settings();
    }
}

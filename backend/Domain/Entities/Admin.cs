using backend.Domain.Common;


namespace backend.Domain.Entities
{
    public class Admin : User
    {
        public bool CanBanUsers { get; set; }
        public bool CanReviewReports { get; set; }

    }
}

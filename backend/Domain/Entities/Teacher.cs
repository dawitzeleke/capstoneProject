using backend.Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Teacher : User
    {
        public bool IsVerified { get; set; }
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
        public string LicenseDocumentUrl { get; set; }
        public List<string> Subjects { get; set; }
        public DateTime VerifiedAt { get; set; }
        public string VerifiedBy { get; set; }

    }
}

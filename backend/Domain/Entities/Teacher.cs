using backend.Domain.Common;
using Domain.Enums;
using MongoDB.Bson.Serialization;

namespace Domain.Entities
{
    public class Teacher : User
    {
        public bool IsVerified { get; set; }
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.UnVerified;
        public string LicenseDocumentUrl { get; set; }
        public List<string> Subjects { get; set; }
        public DateTime? VerifiedAt { get; set; }

        public DateTime? VerificationRequestDate { get; set; }
        public string VerifiedBy { get; set; }

        public string GraduationDocumentUrl { get; set; }

        public string SchoolName { get; set; }

        public StatusTypeEnum Status { get; set; } = StatusTypeEnum.Active;

        public BanInfo? BanDetails { get; set; }
    }
}

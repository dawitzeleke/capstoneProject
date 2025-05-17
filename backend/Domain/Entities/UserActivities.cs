using backend.Domain.Common;
using MongoDB.Bson.Serialization.Attributes;

public class UserActivity : BaseEntity
{
    public string UserId { get; set; }
    public string Role { get; set; }
    public DateTime LastActive { get; set; }

    [BsonIgnore]
    public override DateTime? CreatedAt { get; set; }

    [BsonIgnore]
    public override DateTime? UpdatedAt { get; set; }

    [BsonIgnore]
    public override string? UpdatedBy { get; set; }
}

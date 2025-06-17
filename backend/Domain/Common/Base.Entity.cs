using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Domain.Common;
public abstract class BaseEntity
    {
        [BsonId] 
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }
        public virtual DateTime? CreatedAt { get; set; }
        public virtual DateTime? UpdatedAt { get; set; }
        public virtual string? UpdatedBy { get; set; }
    }

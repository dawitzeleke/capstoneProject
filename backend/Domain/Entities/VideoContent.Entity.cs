using backend.Domain.Common;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Domain.Entities;

public class VideoContent : ContentEntity
{
    [BsonIgnore]
    public override string Id { get; set; }

    public string? Title { get; set; }
    public string? Description { get; set; }
    public string VideoUrl { get; set; }
    public string ThumbnailId { get; set; }
    public string PublicId { get; set; }
    public int Views { get; set; }
    public string[] Tags { get; set; }
    public string[] Feedbacks { get; set; }
    public string Report { get; set; }
}
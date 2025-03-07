namespace backend.Domain.Common;

public abstract class BaseEntity
    {
        public DateTime? CreatedAt { get; set; }
        public Guid Id { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }

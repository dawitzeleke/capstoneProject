using backend.Domain.Entities;
using backend.Domain.Common;
using backend.Domain.Enums;


namespace backend.Domain.Entities
{
    public class Student : User
    {
        public string ProgressLevel { get; set; }
        public List<string> CompletedQuestions { get; set; }
        public List<string> Badges { get; set; }
        public int Grade { get; set; }
        public HashSet<string> SavedQuestions { get; set; } = new HashSet<string>();
        public HashSet<string> SavedContents { get; set; } = new HashSet<string>();

        public StreamEnum Stream { get; set; }
        public string School { get; set; }

    }
}

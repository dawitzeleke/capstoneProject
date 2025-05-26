using backend.Domain.Entities;
using backend.Domain.Common;


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

    }
}

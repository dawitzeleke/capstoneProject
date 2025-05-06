namespace backend.Domain.Enums;
public enum ReportType
{
    Spam,
    HateSpeech,
    Violence,
    InappropriateContent,
    Misinformation,
    WrongAnswer,
    OutOfContext,
    OutOfGrade,
    Other
}

public enum ReportResolutionType{
    ContentRemoved,
    NoIssueFound,
    SentForEditing
}
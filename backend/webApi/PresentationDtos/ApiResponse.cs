namespace backend.webApi.PresentationDtos;
public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = null;
    public object Data { get; set; }

    public ApiResponse(bool success, string message, object data)
    {
        Success = success;
        Message = message;
        Data = data;
    }

     // Static helper methods for common responses
    public static ApiResponse SuccessResponse(object data, string message = "Operation successful.")
    {
        return new ApiResponse(true, message, data);
    }

    public static ApiResponse ErrorResponse(string message = "Operation failed.")
    {
        return new ApiResponse(false, message, null!); // Pass null for data in error cases
    }
}


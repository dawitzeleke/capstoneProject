namespace backend.Application.Features.Identity.DTOs
{
    public class AuthResponseDto
    {
        public bool Success { get; set; } // Indicates if request was successful
        public string UserId { get; set; } // ID of the registered/logged-in user
        public string Email { get; set; } // Email of the user
        public string Token { get; set; } // JWT token for authentication
        public string Message { get; set; } // Success/Error message
    }
}

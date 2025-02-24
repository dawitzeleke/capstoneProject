using System.ComponentModel.DataAnnotations;

namespace backend.Application.Features.Identity.DTOs
{
    public class LoginUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        public string Password { get; set; }
    }
}

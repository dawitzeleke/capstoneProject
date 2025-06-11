using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Application.Dtos.AuthDtos
{
    public class AuthResponseDto
    {
        public string Id { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string ProfilePictureUrl { get; set; }

    }
}

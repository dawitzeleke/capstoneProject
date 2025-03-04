using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Application.Models.Identity
{
    public  class AppUser
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName {get; set;}
    }
}
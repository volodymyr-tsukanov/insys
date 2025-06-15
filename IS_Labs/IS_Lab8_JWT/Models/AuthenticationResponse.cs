using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IS_Lab8_JWT.Entities;

namespace IS_Lab8_JWT.Models
{
    public class AuthenticationResponse
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }

        public AuthenticationResponse(User user, string
       token)
        {
            Id = user.Id;
            Username = user.Username;
            Token = token;
        }

    }
}

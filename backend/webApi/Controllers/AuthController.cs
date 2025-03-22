using Application.Dtos.AuthDtos;
// using Application.Handlers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("signup/student")]
        public async Task<IActionResult> SignUpStudent([FromForm] SignUpStudentCommand query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // [HttpPost("signup/teacher")]
        // public async Task<IActionResult> SignUpTeacher([FromForm] SignUpTeacherDto request)
        // {
        //     var token = await _authService.SignUpTeacher(request, "Teacher");
        //     return Ok(new { Token = token });
        // }

        // [HttpPost("signup/admin")]
        // public async Task<IActionResult> SignUpAdmin([FromForm] AuthRequestDto request)
        // {
        //     var token = await _authService.SignUp(request, "Admin");
        //     return Ok(new { Token = token });
        // }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromForm] SignInQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}

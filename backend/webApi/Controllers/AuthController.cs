using Application.Dtos.AuthDtos;
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

        [HttpPost("student/signup")]
        public async Task<IActionResult> SignUpStudent([FromForm] SignUpStudentCommand query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("teacher/signup")]
        public async Task<IActionResult> SignUpTeacher([FromForm] SignUpTeacherCommand query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("admin/signup")]
        public async Task<IActionResult> SignUpAdmin([FromForm] SignUpAdminCommand query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }


        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromForm] SignInQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("send-reset-code")]
        public async Task<IActionResult> SendResetCode([FromBody] SendResetCodeCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        
        [HttpPost("reset-password")]    
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}

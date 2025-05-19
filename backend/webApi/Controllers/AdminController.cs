using Application.Dtos.AuthDtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{

    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize]
        [HttpPost("invite-admin")]
        public async Task<IActionResult> InviteAdmin([FromBody] InviteAdminCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize]
        [HttpPatch("verify-teacher")]
        public async Task<IActionResult> VerifyTeacher([FromBody] VerifyTeacherCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}

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

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("invite-admin")]
        public async Task<IActionResult> InviteAdmin([FromBody] InviteAdminCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin, Admin")]
        [HttpPatch("verify-teacher")]
        public async Task<IActionResult> VerifyTeacher([FromBody] VerifyTeacherCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin, Admin")]
        [HttpPatch("ban-teacher")]
        public async Task<IActionResult> BanTeacher([FromBody] BanTeacherCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        [Authorize(Roles = "SuperAdmin, Admin")]
        [HttpGet("get-teachers")]
        public async Task<IActionResult> GetTeachers([FromQuery] GetTeachersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);  
        }
    }
}

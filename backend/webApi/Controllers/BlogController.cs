
using Application.Dtos.AuthDtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{

    [ApiController]
    [Route("api/blog")]
    public class BlogController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BlogController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromForm] CreateBlogCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize(Roles = "Teacher")]
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateBlog([FromForm] UpdateBlogCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize(Roles = "Teacher")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBlog(string id)
        {
            var result = await _mediator.Send(new DeleteBlogCommand { Id = id });
            return Ok(result);
        }
        [Authorize(Roles = "Teacher, Student")]
        [HttpPost("like")]
        public async Task<IActionResult> LikeBlog([FromBody] LikeBlogCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        [Authorize(Roles = "Teacher, Student")]
        [HttpPost("save")]
        public async Task<IActionResult> SaveBlog([FromBody] SaveBlogCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        // [Authorize(Roles = "Teacher")]
        // [HttpGet("get/{id}")]
        // public async Task<IActionResult> GetBlog(string id)
        // {
        //     var result = await _mediator.Send(new GetBlogQuery { Id = id });
        //     return Ok(result);
        // }

        [Authorize(Roles = "Teacher, Student")]
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllBlogs([FromQuery] GetAllBlogsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // [Authorize(Roles = "Teacher, Student")]
        // [HttpGet("get-by-tag")]
        // public async Task<IActionResult> GetBlogsByTag([FromQuery] GetBlogsByTagQuery query)
        // {
        //     var result = await _mediator.Send(query);
        //     return Ok(result);
        // }

        // [Authorize(Roles = "Teacher, Student")]
        // [HttpGet("get-by-category")]
        // public async Task<IActionResult> GetBlogsByCategory([FromQuery] GetBlogsByCategoryQuery query)
        // {
        //     var result = await _mediator.Send(query);
        //     return Ok(result);
        // }

        // [Authorize(Roles = "Teacher, Student")]
        // [HttpGet("get-by-author")]
        // public async Task<IActionResult> GetBlogsByAuthor([FromQuery] GetBlogsByAuthorQuery query)
        // {
        //     var result = await _mediator.Send(query);
        //     return Ok(result);
        // }

        // [Authorize(Roles = "Teacher, Student")]
        // [HttpGet("get-by-date")]
        // public async Task<IActionResult> GetBlogsByDate([FromQuery] GetBlogsByDateQuery query)
        // {
        //     var result = await _mediator.Send(query);
        //     return Ok(result);
        // }

    }
}
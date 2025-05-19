using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Application.Features.Questions.Queries.GetQuestionDetail;
using backend.Application.Features.Questions.Queries.GetQuestionList;
using backend.Application.Features.Questions.Commands.DeleteQuestion;
using backend.Application.Features.Questions.Commands.UpdateQuestion;
using backend.Domain.Enums; 

namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class QuestionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public QuestionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllQuestions(
        [FromQuery] int? grade,
        [FromQuery] StreamEnum? stream,
        [FromQuery] string? courseName)
    {

        // additional logics will be added here like filtering and personalizing
        var filter = new GetQuestionListQuery
            {
                Grade = grade,
                Stream = stream,
                CourseName = courseName,
                // CreatorId = creatorId,
                // StudentId = studentId
            };
        var questions = await _mediator.Send(new GetQuestionListQuery(){});
        return Ok(questions);


    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestionById(string id)
    {
        var question = await _mediator.Send(new GetQuestionDetailQuery{ Id = id });
        return Ok(question);
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuestion([FromForm] CreateQuestionCommand question)
    {
        var response= await _mediator.Send(question);
        return Ok(response);
    }
    
    [HttpPut]
    public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestionCommand question)
    {
        var response = await _mediator.Send(question);
        if (response == null)
        {
            return NotFound();
        }
        return Ok(question);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteQuestion(DeleteQuestionCommand request)
    {
        var response= await _mediator.Send(request);
        if (response)
        {
            return Ok();
        }
        return NotFound();
    }
}
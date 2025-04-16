using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Application.Features.Questions.Queries.GetQuestionDetail;
using backend.Application.Features.Questions.Queries.GetQuestionList;

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
    public async Task<IActionResult> GetAllQuestions()
    {
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
        System.Console.WriteLine("input data",question);
        Console.WriteLine($"Received Question: {System.Text.Json.JsonSerializer.Serialize(question)}");
        var response= await _mediator.Send(question);
        return Ok(response);
    }

    // [HttpPut]
    // public async Task<IActionResult> Put(Question question)
    // {
    //     await _mediator.Send(question);
    //     return Ok(question);
    // }

    // [HttpDelete]
    // public async Task<IActionResult> Delete(Question question)
    // {
    //     await _mediator.Send(question);
    //     return Ok(question);
    // }
}
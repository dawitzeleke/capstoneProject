using Microsoft.AspNetCore.Mvc;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using System.Threading.Tasks;

namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class QuestionsController : ControllerBase
{
    private readonly IQuestionRepository _questionRepository;

    public QuestionsController(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var questions = await _questionRepository.GetAllAsync();
        return Ok(questions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        return Ok(question);
    }

    [HttpPost]
    public async Task<IActionResult> Post(Question question)
    {
        await _questionRepository.CreateAsync(question);
        return Ok(question);
    }

    [HttpPut]
    public async Task<IActionResult> Put(Question question)
    {
        await _questionRepository.UpdateAsync(question);
        return Ok(question);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Question question)
    {
        await _questionRepository.DeleteAsync(question);
        return Ok(question);
    }
}
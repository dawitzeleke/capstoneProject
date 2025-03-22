//using System.Collections.Generic;
//using System.Threading.Tasks;
//using backend.Application.Contracts.Persistence;
//using backend.Domain.Entities;
//using Microsoft.AspNetCore.Mvc;


//namespace backend.webApi.Controllers;
//[ApiController]
//[Route("api/[controller]")]
//public class StudentController : ControllerBase
//{
//    private readonly IStudentRepository _studentRepository;

//    public StudentController(IStudentRepository studentRepository)
//    {
//        _studentRepository = studentRepository;
//    }

//    [HttpGet]
//    public async Task<IActionResult> Get()
//    {
//        var students = await _studentRepository.GetAllAsync();
//        // return Ok(students);
//        return Ok("it works");
//    }

//    [HttpGet("{id}")]
//    public async Task<IActionResult> Get(int id)
//    {
//        var student = await _studentRepository.GetByIdAsync(id);
//        return Ok(student);
//    }

//    [HttpPost]
//    public async Task<IActionResult> Post(Student student)
//    {
//        await _studentRepository.CreateAsync(student);
//        return Ok(student);
//    }

//    [HttpPut]
//    public async Task<IActionResult> Put(Student student)
//    {
//        await _studentRepository.UpdateAsync(student);
//        return Ok(student);
//    }

//    [HttpDelete]
//    public async Task<IActionResult> Delete(Student student)
//    {
//        await _studentRepository.DeleteAsync(student);
//        return Ok(student);
//    }

//    [HttpGet("{id}/grade")]
//    public async Task<IActionResult> GetStudentGrade(int id)
//    {
//        var grade = await _studentRepository.GetStudentGrade(id);
//        return Ok(grade);
//    }
//}
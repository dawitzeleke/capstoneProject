using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using FluentValidation;

namespace backend.webApi.ExceptionHandlerMiddleware;

public class ProblemDetails
{
    public string Title { get; set; }
    public string Detail { get; set; }
    public int? Status { get; set; }
    public string Source { get; set; }
    public string Message { get; set; }
    public string Instance { get; set; }
    public Dictionary<string, object> Extensions { get; set; } =  new Dictionary<string, object>();
}

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var problemDetails = new ProblemDetails
        {
            Instance = context.Request.Path,
            Detail = exception.Message
        };
        problemDetails.Title = exception.GetType().Name;
        
        problemDetails.Status = StatusCodes.Status500InternalServerError;
        problemDetails.Source = context.Request.Path;
        problemDetails.Message = exception.Message;
        // problemDetails.Extensions["errors"] = validationException.Errors;
        
        // switch (exception)
        // {
        //     case ValidationException validationException:
        //         problemDetails.Title = "Validation error";
        //         problemDetails.Status = StatusCodes.Status400BadRequest;
        //         problemDetails.Extensions["errors"] = validationException.Errors;
        //         break;
        //     case NotFoundException _:
        //         problemDetails.Title = "Not found";
        //         problemDetails.Status = StatusCodes.Status404NotFound;
        //         break;
        //     default:
        //         problemDetails.Title = "An error occurred";

        //         problemDetails.Status = StatusCodes.Status500InternalServerError;
        //         break;
        // }


        // _logger.LogError(ex, "An unhandled exception occurred.");
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        // await context.Response.WriteAsync("An unexpected error occurred. Please try again later.");
        context.Response.StatusCode = problemDetails.Status.Value;
        context.Response.ContentType = "application/problem+json";
        
        return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}
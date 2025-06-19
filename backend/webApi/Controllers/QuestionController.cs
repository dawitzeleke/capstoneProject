using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Application.Features.Questions.Queries.GetQuestionDetail;
using backend.Application.Features.Questions.Queries.GetQuestionList;
using backend.Application.Features.Questions.Commands.DeleteQuestion;
using backend.Application.Features.Questions.Commands.UpdateQuestion;
using backend.Application.Features.Students.Commands.SaveQuestion;
using backend.Application.Features.Questions.Queries.GetCustomExam;
using backend.Application.Features.Questions.Commands.LikeQuestion;
using backend.Application.Features.Questions.Commands.AddRelatedBlog;
using backend.Application.Features.Questions.Commands.RemoveRelatedBlog;
using backend.Application.Dtos.PaginationDtos;
using backend.webApi.PresentationDtos;
using backend.Domain.Enums;
using backend.Application.Features.Teachers.Queries.GetDraft;
using backend.Application.Features.Questions.Queries.GetTeachersQuestion;




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

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAllQuestions(
        [FromQuery] int? grade,
        [FromQuery] StreamEnum? stream,
        [FromQuery] string? courseName,
        [FromQuery] int? limit,
        [FromQuery] int? lastSolveCount,
        [FromQuery] string? lastId,
        [FromQuery] DifficultyLevel? DifficultyLevel = null)
    {

        var query = new GetQuestionListQuery
        {
            Grade = grade,
            Stream = stream,
            CourseName = courseName,
            DifficultyLevel = DifficultyLevel,
            Pagination = new PaginationDto
            {
                Limit = limit ?? 20, // Default limit if not provided
                LastSolveCount = lastSolveCount,
                LastId = lastId
            }
        };
        var questions = await _mediator.Send(query);
        Console.WriteLine($"Questions count: {questions?.Items?.Count ?? 0}");
        if (questions == null || questions.Items == null || questions.Items.Count == 0)
        {
            return NotFound(ApiResponse.ErrorResponse("No questions found"));
        }
        return Ok(ApiResponse.SuccessResponse(questions, "Questions retrieved successfully"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestionById(string id)
    {
        var question = await _mediator.Send(new GetQuestionDetailQuery { Id = id });
        if (question == null)
        {
            return NotFound(new ApiResponse(false, "Question not found", null));
        }
        return Ok(new ApiResponse(true, "Question retrieved successfully", question));
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost]
    public async Task<IActionResult> CreateQuestion([FromForm] CreateQuestionCommand question)
    {
        var response = await _mediator.Send(question);
        if (response == null)
        {
            return BadRequest(new ApiResponse(false, "Failed to create question", null));
        }
        return Ok(new ApiResponse(true, "Question created successfully", response));
    }

    [Authorize(Roles = "Teacher")]
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

    [Authorize(Roles = "Teacher")]
    [HttpDelete]
    public async Task<IActionResult> DeleteQuestion(DeleteQuestionCommand request)
    {
        var response = await _mediator.Send(request);
        if (response)
        {
            return Ok();
        }
        return NotFound();
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("posted-questions")]
    public async Task<IActionResult> GetPostedQuestionsByTeacher()
    {
        var response = await _mediator.Send(new GetTeachersPostedQuestionQuery());
        if (response == null || response.Count == 0)
        {
            return NotFound(new ApiResponse(false, "No posted questions found", null));
        }
        return Ok(new ApiResponse(true, "Posted questions retrieved successfully", response));
    }


    [Authorize(Roles = "Teacher")]
    [HttpPost("create-draft")]
    public async Task<IActionResult> CreateDraftQuestion([FromForm] CreateQuestionCommand draftQuestion)
    {
        draftQuestion.Status = ContentStatusEnum.Draft;
        var response = await _mediator.Send(draftQuestion);
        if (response == null)
        {
            return BadRequest(new ApiResponse(false, "Failed to create draft question", null));
        }
        return Ok(new ApiResponse(true, "Draft question created successfully", response));
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("draft")]
    public async Task<IActionResult> GetDraftQuestion([FromQuery] ContentTypeEnum contentType, [FromQuery] int totalCount = 10)
    {
        var request = new GetDraftQuery
        {
            contentType = contentType,
            totalCount = totalCount
        };
        var result = await _mediator.Send(request);
        if (result == null || result.Count == 0)
        {
            return NotFound(new ApiResponse(false, "No draft questions found", null));
        }
        return Ok(new ApiResponse(true, "Draft questions retrieved successfully", result));

    }

    [Authorize(Roles = "Teacher")]
    [HttpPut("draft")]
    public async Task<IActionResult> UpdateDraftQuestion([FromForm] UpdateQuestionCommand question)
    {
        question.Status = ContentStatusEnum.Draft;
        var response = await _mediator.Send(question);
        if (response == null)
        {
            return NotFound(new ApiResponse(false, "Draft question not found", null));
        }
        return Ok(new ApiResponse(true, "Draft question updated successfully", response));
    }



    [Authorize(Roles = "Student")]
    [HttpGet("custom-exam")]
    public async Task<IActionResult> GetCustomExam(
        [FromQuery] int? grade,
        [FromQuery] DifficultyLevel? difficultyLevel,
        [FromQuery] string? courseName)
    {
        var filter = new GetCustomExamQuery
        {
            Grade = grade,
            DifficultyLevel = difficultyLevel,
            CourseName = courseName,
        };
        var questions = await _mediator.Send(filter);
        return Ok(questions);
    }

    [Authorize(Roles = "Student")]
    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeQuestion(string questionId)
    {
        var response = await _mediator.Send(new LikeQuestionCommand(questionId));
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Question liked successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to like question"));
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost("{id}/related-blog")]
    public async Task<IActionResult> AddRelatedBlog(string id, [FromBody] string blogId)
    {
        var response = await _mediator.Send(new AddRelatedBlogCommand { QuestionId = id, BlogId = blogId });
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Related blog added successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to add related blog"));
    }

    [Authorize(Roles = "Teacher")]
    [HttpDelete("{id}/related-blog")]
    public async Task<IActionResult> RemoveRelatedBlog(string id, [FromBody] string blogId)
    {
        var response = await _mediator.Send(new RemoveRelatedBlogCommand { QuestionId = id, BlogId = blogId });
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Related blog removed successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to remove related blog"));
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost("test")]
    public async Task<IActionResult> TestQuestion()
    {
        var teacherIds = new[] { "68342177bf5fab1394bff22a", "682ada4c871f027f3049266d" };
        var questions = new List<CreateQuestionCommand>();

        // 10 Real English Questions
        questions.AddRange(new[]
        {
            new CreateQuestionCommand {
                QuestionText = "Which of the following is a synonym for 'benevolent'?",
                Description = "Vocabulary synonym",
                Options = new[] { "Cruel", "Kind", "Lazy", "Mean" },
                CorrectOption = "Kind",
                CourseName = "English",
                Point = 5,
                Grade = 12,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.SocialSience,
                Hint = "It's the opposite of malevolent.",
                Tags = new[] { "vocabulary", "synonym" },
                Explanation = "'Benevolent' means well-meaning and kindly."
            },
            new CreateQuestionCommand {
                QuestionText = "Identify the main clause in the sentence: 'Although it was raining, we went for a walk.'",
                Description = "Grammar clause analysis",
                Options = new[] { "Although it was raining", "We went for a walk", "It was raining", "For a walk" },
                CorrectOption = "We went for a walk",
                CourseName = "English",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.SocialSience,
                Hint = "The main clause can stand alone.",
                Tags = new[] { "grammar", "clauses" },
                Explanation = "The main clause is independent: 'We went for a walk'."
            },
            new CreateQuestionCommand {
                QuestionText = "Which of the following is an example of a simile?",
                Description = "Literary devices question",
                Options = new[] { "The stars danced in the sky", "Her smile was the sun", "He was as brave as a lion", "Time flew by" },
                CorrectOption = "He was as brave as a lion",
                CourseName = "English",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.SocialSience,
                Hint = "Similes use 'like' or 'as'.",
                Tags = new[] { "literary device", "simile" },
                Explanation = "Similes compare two things using 'like' or 'as'."
            },
            new CreateQuestionCommand {
                QuestionText = "What type of sentence is: 'Please close the door'?",
                Description = "Sentence type classification",
                Options = new[] { "Declarative", "Interrogative", "Imperative", "Exclamatory" },
                CorrectOption = "Imperative",
                CourseName = "English",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.SocialSience,
                Hint = "It gives a command.",
                Tags = new[] { "sentence types", "imperative" },
                Explanation = "An imperative sentence gives an order or request."
            },
            new CreateQuestionCommand {
                QuestionText = "Which one is an example of a homophone?",
                Description = "Spelling and sound",
                Options = new[] { "Read - Red", "There - Their", "Peace - Piece", "All of the above" },
                CorrectOption = "All of the above",
                CourseName = "English",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.SocialSience,
                Hint = "Homophones sound the same.",
                Tags = new[] { "homophones", "vocabulary" },
                Explanation = "All given pairs sound the same but have different meanings."
            },
            new CreateQuestionCommand {
                QuestionText = "Which sentence is grammatically correct?",
                Description = "Grammar check",
                Options = new[] { "He don’t like coffee", "She doesn’t likes tea", "They doesn’t know", "She doesn’t like tea" },
                CorrectOption = "She doesn’t like tea",
                CourseName = "English",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.SocialSience,
                Hint = "Watch subject-verb agreement.",
                Tags = new[] { "grammar", "subject-verb" },
                Explanation = "'She doesn't like tea' is correct subject-verb agreement."
            },
            new CreateQuestionCommand {
                QuestionText = "What is the antonym of 'abundant'?",
                Description = "Antonym vocabulary",
                Options = new[] { "Plentiful", "Scarce", "Generous", "Ample" },
                CorrectOption = "Scarce",
                CourseName = "English",
                Point = 5,
                Grade = 12,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.SocialSience,
                Hint = "Think of shortage.",
                Tags = new[] { "antonyms", "vocabulary" },
                Explanation = "The opposite of 'abundant' is 'scarce'."
            },
            new CreateQuestionCommand {
                QuestionText = "Which of the following is an example of personification?",
                Description = "Literary device question",
                Options = new[] { "The wind whispered through the trees", "As fast as lightning", "Braver than a lion", "A big fish" },
                CorrectOption = "The wind whispered through the trees",
                CourseName = "English",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.SocialSience,
                Hint = "Giving human qualities to non-human things.",
                Tags = new[] { "literary device", "personification" },
                Explanation = "The wind cannot whisper — it’s personified."
            },
            new CreateQuestionCommand {
                QuestionText = "What part of speech is the word 'quickly'?",
                Description = "Grammar identification",
                Options = new[] { "Adjective", "Verb", "Adverb", "Preposition" },
                CorrectOption = "Adverb",
                CourseName = "English",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.SocialSience,
                Hint = "Describes how something happens.",
                Tags = new[] { "parts of speech", "grammar" },
                Explanation = "'Quickly' modifies a verb and is an adverb."
            },
            new CreateQuestionCommand {
                QuestionText = "Choose the correct reported speech: She said, 'I am tired.'",
                Description = "Reported speech",
                Options = new[] { "She said that she was tired", "She said she is tired", "She said that I am tired", "She said that she tired" },
                CorrectOption = "She said that she was tired",
                CourseName = "English",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.SocialSience,
                Hint = "Past tense is needed.",
                Tags = new[] { "reported speech", "grammar" },
                Explanation = "Change tense in reported speech from present to past."
            }
        });

        questions.AddRange(new[]
        {
            new CreateQuestionCommand {
                QuestionText = "What is the basic unit of life?",
                Description = "Intro to cells",
                Options = new[] { "Tissue", "Organ", "Cell", "Molecule" },
                CorrectOption = "Cell",
                CourseName = "Biology",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "All organisms are made of it.",
                Tags = new[] { "cells", "basics" },
                Explanation = "The cell is the smallest unit of life."
            },
            new CreateQuestionCommand {
                QuestionText = "Which part of the plant is responsible for photosynthesis?",
                Description = "Plant biology",
                Options = new[] { "Root", "Stem", "Leaf", "Flower" },
                CorrectOption = "Leaf",
                CourseName = "Biology",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Green and flat.",
                Tags = new[] { "plants", "photosynthesis" },
                Explanation = "Chloroplasts in leaves absorb light."
            },
            new CreateQuestionCommand {
                QuestionText = "Which organelle produces ATP?",
                Description = "Cell biology",
                Options = new[] { "Nucleus", "Mitochondria", "Ribosome", "Golgi body" },
                CorrectOption = "Mitochondria",
                CourseName = "Biology",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Powerhouse of the cell.",
                Tags = new[] { "organelle", "energy" },
                Explanation = "Mitochondria generate cellular energy (ATP)."
            },
            new CreateQuestionCommand {
                QuestionText = "Which blood cells help in clotting?",
                Description = "Human biology",
                Options = new[] { "Red blood cells", "White blood cells", "Platelets", "Plasma" },
                CorrectOption = "Platelets",
                CourseName = "Biology",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Not cells but fragments.",
                Tags = new[] { "blood", "clotting" },
                Explanation = "Platelets form clots to prevent bleeding."
            },
            new CreateQuestionCommand {
                QuestionText = "What is the genetic material in cells?",
                Description = "Genetics intro",
                Options = new[] { "RNA", "Protein", "Lipid", "DNA" },
                CorrectOption = "DNA",
                CourseName = "Biology",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Found in chromosomes.",
                Tags = new[] { "DNA", "genes" },
                Explanation = "DNA stores genetic information."
            },
            new CreateQuestionCommand {
                QuestionText = "Which human system includes the brain and spinal cord?",
                Description = "Systems of the body",
                Options = new[] { "Digestive", "Circulatory", "Nervous", "Respiratory" },
                CorrectOption = "Nervous",
                CourseName = "Biology",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Controls body activity.",
                Tags = new[] { "human body", "nervous system" },
                Explanation = "The CNS includes brain and spinal cord."
            },
            new CreateQuestionCommand {
                QuestionText = "What is the function of xylem in plants?",
                Description = "Plant tissues",
                Options = new[] { "Transport food", "Transport water", "Photosynthesis", "Reproduction" },
                CorrectOption = "Transport water",
                CourseName = "Biology",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Moves upward from roots.",
                Tags = new[] { "xylem", "transport" },
                Explanation = "Xylem transports water and minerals."
            },
            new CreateQuestionCommand {
                QuestionText = "Which of these is NOT a function of the skeleton?",
                Description = "Skeletal system",
                Options = new[] { "Support", "Protection", "Transport", "Movement" },
                CorrectOption = "Transport",
                CourseName = "Biology",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Think of blood vessels.",
                Tags = new[] { "skeleton", "functions" },
                Explanation = "Transport is the function of circulatory system, not skeleton."
            },
            new CreateQuestionCommand {
                QuestionText = "Which gas is produced during photosynthesis?",
                Description = "Photosynthesis products",
                Options = new[] { "Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen" },
                CorrectOption = "Oxygen",
                CourseName = "Biology",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "We breathe it.",
                Tags = new[] { "photosynthesis", "oxygen" },
                Explanation = "Plants release oxygen as a by-product of photosynthesis."
            },
            new CreateQuestionCommand {
                QuestionText = "Which vitamin is essential for blood clotting?",
                Description = "Human nutrition",
                Options = new[] { "Vitamin A", "Vitamin D", "Vitamin K", "Vitamin C" },
                CorrectOption = "Vitamin K",
                CourseName = "Biology",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "K for Klotting!",
                Tags = new[] { "vitamins", "nutrition" },
                Explanation = "Vitamin K is needed for synthesis of clotting factors."
            }

        }
        );
        questions.AddRange(new[]
    {
                // PHYSICS
                new CreateQuestionCommand {
                    QuestionText = "What is the unit of force?",
                    Description = "Units in physics",
                    Options = new[] { "Joule", "Newton", "Pascal", "Watt" },
                    CorrectOption = "Newton",
                    CourseName = "Physics",
                    Point = 5,
                    Grade = 9,
                    Difficulty = DifficultyLevel.Easy,
                    QuestionType = QuestionTypeEnum.MultipleChoice,
                    CreatedBy = teacherIds[0],
                    Stream = StreamEnum.NaturalScience,
                    Hint = "Named after a famous scientist.",
                    Tags = new[] { "units", "force" },
                    Explanation = "The SI unit of force is Newton (N)."
                },
                new CreateQuestionCommand {
                    QuestionText = "What does Newton's First Law state?",
                    Description = "Laws of motion",
                    Options = new[] { "F = ma", "Objects in motion stay in motion", "Energy is conserved", "Action = reaction" },
                    CorrectOption = "Objects in motion stay in motion",
                    CourseName = "Physics",
                    Point = 5,
                    Grade = 10,
                    Difficulty = DifficultyLevel.Medium,
                    QuestionType = QuestionTypeEnum.MultipleChoice,
                    CreatedBy = teacherIds[1],
                    Stream = StreamEnum.NaturalScience,
                    Hint = "Also called the law of inertia.",
                    Tags = new[] { "laws of motion" },
                    Explanation = "It describes inertia — objects resist change in motion."
                },

                new CreateQuestionCommand {
                    QuestionText = "Which form of energy is stored in a stretched rubber band?",
                    Description = "Types of energy",
                    Options = new[] { "Kinetic", "Potential", "Thermal", "Chemical" },
                    CorrectOption = "Potential",
                    CourseName = "Physics",
                    Point = 5,
                    Grade = 9,
                    Difficulty = DifficultyLevel.Easy,
                    QuestionType = QuestionTypeEnum.MultipleChoice,
                    CreatedBy = teacherIds[0],
                    Stream = StreamEnum.NaturalScience,
                    Hint = "Stored energy.",
                    Tags = new[] { "energy", "potential energy" },
                    Explanation = "Potential energy is stored in stretched or compressed objects."
                },
                new CreateQuestionCommand
    {
        QuestionText = "What is the acceleration due to gravity on Earth?",
        Description = "Gravity and acceleration",
        Options = new[] { "9.8 m/s²", "6.67 m/s²", "3.0 m/s²", "1.6 m/s²" },
        CorrectOption = "9.8 m/s²",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Easy,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It's approximately 10 m/s².",
        Tags = new[] { "gravity", "acceleration", "earth" },
        Explanation = "The standard acceleration due to gravity on Earth is 9.8 meters per second squared."
    },

    new CreateQuestionCommand
    {
        QuestionText = "Which subatomic particle has a negative charge?",
        Description = "Atomic structure",
        Options = new[] { "Proton", "Neutron", "Electron", "Positron" },
        CorrectOption = "Electron",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Easy,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It's found outside the nucleus.",
        Tags = new[] { "atomic structure", "particles", "charge" },
        Explanation = "Electrons are negatively charged subatomic particles found in the electron cloud."
    },

    new CreateQuestionCommand
    {
        QuestionText = "What is the speed of light in vacuum?",
        Description = "Fundamental constants",
        Options = new[] { "3.0 x 10^8 m/s", "1.5 x 10^8 m/s", "3.0 x 10^6 m/s", "1.5 x 10^6 m/s" },
        CorrectOption = "3.0 x 10^8 m/s",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Medium,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It's a universal constant denoted by 'c'.",
        Tags = new[] { "speed of light", "constants", "vacuum" },
        Explanation = "The speed of light in vacuum is approximately 3.0 x 10^8 meters per second."
    },

    new CreateQuestionCommand
    {
        QuestionText = "Which law explains why we need to wear seatbelts?",
        Description = "Laws of motion and safety",
        Options = new[] { "Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Universal Gravitation" },
        CorrectOption = "Newton's First Law",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Easy,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "Also called the law of inertia.",
        Tags = new[] { "laws of motion", "safety", "inertia" },
        Explanation = "Newton's First Law states that an object in motion stays in motion unless acted upon by an external force."
    },

    new CreateQuestionCommand
    {
        QuestionText = "What is the main energy transformation in a hydroelectric power plant?",
        Description = "Energy conversion",
        Options = new[] { "Kinetic to electrical", "Chemical to thermal", "Thermal to kinetic", "Electrical to chemical" },
        CorrectOption = "Kinetic to electrical",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Medium,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It involves moving water and generators.",
        Tags = new[] { "energy", "hydroelectric", "transformation" },
        Explanation = "Hydroelectric plants convert the kinetic energy of moving water into electrical energy."
    },

    new CreateQuestionCommand
    {
        QuestionText = "Which phenomenon causes a straw to appear bent in a glass of water?",
        Description = "Light and optics",
        Options = new[] { "Reflection", "Refraction", "Diffraction", "Dispersion" },
        CorrectOption = "Refraction",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Easy,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It's the bending of light as it passes from one medium to another.",
        Tags = new[] { "optics", "refraction", "light" },
        Explanation = "Refraction is the bending of light as it passes from one medium to another, making the straw appear bent."
    },

    new CreateQuestionCommand
    {
        QuestionText = "What is the SI unit of power?",
        Description = "Units and measurements",
        Options = new[] { "Joule", "Watt", "Newton", "Pascal" },
        CorrectOption = "Watt",
        CourseName = "Physics",
        Point = 5,
        Grade = 10,
        Difficulty = DifficultyLevel.Easy,
        QuestionType = QuestionTypeEnum.MultipleChoice,
        CreatedBy = teacherIds[1],
        Stream = StreamEnum.NaturalScience,
        Hint = "It's named after James Watt.",
        Tags = new[] { "units", "power", "SI" },
        Explanation = "The watt (W) is the SI unit of power, named after James Watt."
    },
            // CHEMISTRY
                    new CreateQuestionCommand {
                QuestionText = "What is the center of an atom called?",
                Description = "Atomic structure",
                Options = new[] { "Electron", "Nucleus", "Proton", "Neutron" },
                CorrectOption = "Nucleus",
                CourseName = "Chemistry",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "It contains protons and neutrons.",
                Tags = new[] { "atom", "nucleus" },
                Explanation = "The nucleus is the dense core of an atom."
            },
            new CreateQuestionCommand {
                QuestionText = "What type of reaction is: HCl + NaOH → NaCl + H₂O?",
                Description = "Chemical reaction types",
                Options = new[] { "Decomposition", "Displacement", "Neutralization", "Combustion" },
                CorrectOption = "Neutralization",
                CourseName = "Chemistry",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Acid + Base → Salt + Water",
                Tags = new[] { "reactions", "neutralization" },
                Explanation = "This is a neutralization reaction between an acid and a base."
            },
            new CreateQuestionCommand {
                QuestionText = "Which of the following is a base?",
                Description = "Acids and bases",
                Options = new[] { "HCl", "NaOH", "CH₃COOH", "H₂SO₄" },
                CorrectOption = "NaOH",
                CourseName = "Chemistry",
                Point = 5,
                Grade = 11,
                Difficulty = DifficultyLevel.Medium,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Sodium hydroxide.",
                Tags = new[] { "bases", "alkaline" },
                Explanation = "NaOH is a strong base."
            },

            // MATH
            new CreateQuestionCommand {
                QuestionText = "What is the value of x in: 2x + 5 = 11?",
                Description = "Basic algebra",
                Options = new[] { "2", "3", "4", "5" },
                CorrectOption = "3",
                CourseName = "Math",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Isolate x.",
                Tags = new[] { "algebra", "equation solving" },
                Explanation = "2x = 6 → x = 3"
            },
            new CreateQuestionCommand {
                QuestionText = "Find the area of a triangle with base 8cm and height 5cm.",
                Description = "Geometry formula",
                Options = new[] { "40", "20", "13", "30" },
                CorrectOption = "20",
                CourseName = "Math",
                Point = 5,
                Grade = 9,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[1],
                Stream = StreamEnum.NaturalScience,
                Hint = "Area = 1/2 × base × height",
                Tags = new[] { "geometry", "area" },
                Explanation = "Area = 1/2 × 8 × 5 = 20"
            },
            new CreateQuestionCommand {
                QuestionText = "What is the probability of getting a 3 when a dice is rolled?",
                Description = "Probability basics",
                Options = new[] { "1/2", "1/3", "1/6", "1/4" },
                CorrectOption = "1/6",
                CourseName = "Math",
                Point = 5,
                Grade = 10,
                Difficulty = DifficultyLevel.Easy,
                QuestionType = QuestionTypeEnum.MultipleChoice,
                CreatedBy = teacherIds[0],
                Stream = StreamEnum.NaturalScience,
                Hint = "Die has 6 faces.",
                Tags = new[] { "probability", "dice" },
                Explanation = "One favorable outcome out of six → 1/6."
            }
        });

        foreach (var question in questions)
        {
            if (question.CourseName == "English")
            {
                question.CreatedBy = teacherIds[0];
            }
            else if (question.CourseName == "Biology")
            {
                question.CreatedBy = teacherIds[1];
            }
            else
            {
                question.CreatedBy = teacherIds[0];
            }
            var response = await _mediator.Send(question);

        }
        return Ok(("Questions created successfully"));

    }
}
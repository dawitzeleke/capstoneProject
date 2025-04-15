using AutoMapper;
using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UpdateStudentSettingsCommand, Student>();
        }
    }
}
using AutoMapper;
using backend.Domain.Common;
using backend.Domain.Entities;
using Domain.Entities;

namespace backend.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UpdateStudentSettingsCommand, Student>()
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.Ignore())
            .ForMember(dest => dest.ProfilePicturePublicId, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
            
            CreateMap<UpdateTeacherSettingsCommand, Teacher>()
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.Ignore())
            .ForMember(dest => dest.ProfilePicturePublicId, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
        }
    }
}
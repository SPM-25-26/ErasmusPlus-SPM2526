using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappers
{
    public class UserPreferenceMappingProfile : Profile
    {
        public UserPreferenceMappingProfile()
        {
            CreateMap<UserPreference, UserPreferenceDto>().ReverseMap();
        }
    }
}
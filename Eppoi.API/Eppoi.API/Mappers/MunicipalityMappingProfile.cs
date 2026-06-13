using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappers
{
    public class MunicipalityMappingProfile : Profile
    {
        public MunicipalityMappingProfile()
        {
            CreateMap<Municipality, MunicipalitySummaryDto>();
            CreateMap<Municipality, MunicipalityDetailDto>();
        }
    }
}
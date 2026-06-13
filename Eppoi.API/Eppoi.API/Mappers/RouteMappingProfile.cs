using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappings
{
    public class RouteMappingProfile : Profile
    {
        public RouteMappingProfile()
        {
            CreateMap<Entities.Route, RouteSummaryDto>();

            CreateMap<Entities.Route, RouteDetailDto>();

            CreateMap<RouteStage, RouteStageDto>()
                .ForMember(dest => dest.PoiName, opt => opt.MapFrom(src => src.Poi != null ? src.Poi.OfficialName : null));
        }
    }
}
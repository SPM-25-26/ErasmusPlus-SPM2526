using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappers
{
    public class EatAndDrinkMappingProfile : Profile
    {
        public EatAndDrinkMappingProfile()
        {
            CreateMap<PoisEatAndDrink, EatAndDrinkSummaryDto>()
                .ForMember(dest => dest.OfficialName, opt => opt.MapFrom(src => src.IdNavigation.OfficialName))
                .ForMember(dest => dest.PrimaryImagePath, opt => opt.MapFrom(src => src.IdNavigation.PrimaryImagePath))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.IdNavigation.Address));

            CreateMap<PoisEatAndDrink, EatAndDrinkDetailDto>()
                .IncludeBase<PoisEatAndDrink, EatAndDrinkSummaryDto>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.IdNavigation.Description))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.IdNavigation.Email))
                .ForMember(dest => dest.Telephone, opt => opt.MapFrom(src => src.IdNavigation.Telephone))
                .ForMember(dest => dest.Website, opt => opt.MapFrom(src => src.IdNavigation.Website))
                .ForMember(dest => dest.Facebook, opt => opt.MapFrom(src => src.IdNavigation.Facebook))
                .ForMember(dest => dest.Instagram, opt => opt.MapFrom(src => src.IdNavigation.Instagram))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.IdNavigation.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.IdNavigation.Longitude))
                .ForMember(dest => dest.Gallery, opt => opt.MapFrom(src => src.IdNavigation.Gallery));

            CreateMap<TypicalProduct, TypicalProductDto>();
            CreateMap<OpeningHour, OpeningHourDto>();
        }
    }
}
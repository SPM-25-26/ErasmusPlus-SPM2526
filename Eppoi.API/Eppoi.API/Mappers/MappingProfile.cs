using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Article, ArticleSummaryDto>();
            CreateMap<Article, ArticleDetailDto>();
            CreateMap<ArticleParagraph, ArticleParagraphDto>();

            CreateMap<PoisEvent, EventSummaryDto>()
                .ForMember(dest => dest.OrganizerName, opt => opt.MapFrom(src => src.OrganizerTaxCodeNavigation != null ? src.OrganizerTaxCodeNavigation.LegalName : null))
                .ForMember(dest => dest.PrimaryImagePath, opt => opt.MapFrom(src => src.IdNavigation != null ? src.IdNavigation.PrimaryImagePath : null));

            CreateMap<PoisEvent, EventDetailDto>()
                .ForMember(dest => dest.OrganizerName, opt => opt.MapFrom(src => src.OrganizerTaxCodeNavigation != null ? src.OrganizerTaxCodeNavigation.LegalName : null))
                .ForMember(dest => dest.Organizer, opt => opt.MapFrom(src => src.OrganizerTaxCodeNavigation));

            CreateMap<Organization, OrganizerDto>();
            CreateMap<Offer, OfferDto>();
        }
    }
}
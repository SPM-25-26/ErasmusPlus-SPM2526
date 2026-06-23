using AutoMapper;
using Eppoi.API.DTOs;
using Eppoi.API.Entities;

namespace Eppoi.API.Mappings
{
    public class OrganizationMappingProfile : Profile
    {
        public OrganizationMappingProfile()
        {
            CreateMap<Organization, OrganizationSummaryDto>();
            CreateMap<Organization, OrganizationDetailDto>();
        }
    }
}
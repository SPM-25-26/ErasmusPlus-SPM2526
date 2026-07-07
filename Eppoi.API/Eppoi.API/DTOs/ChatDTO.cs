namespace Eppoi.API.DTOs
{
    public class ChatRequestDto
    {
        public string MunicipalityId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public List<string> ReferencedPoiIds { get; set; } = [];
    }
}
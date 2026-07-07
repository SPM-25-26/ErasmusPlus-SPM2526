namespace Eppoi.API.DTOs
{
    public class MatchAppDataResultDTO
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? SourceTable { get; set; }
        public double Similarity { get; set; }
    }
}

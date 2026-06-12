namespace Eppoi.API.DTOs
{
    public class ArticleSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? ImagePath { get; set; }
        public string? TimeToRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string>? Themes { get; set; }
    }

    public class ArticleDetailDto : ArticleSummaryDto
    {
        public string? Script { get; set; }
        public string? Region { get; set; }
        public List<ArticleParagraphDto> Paragraphs { get; set; } = new();
    }

    public class ArticleParagraphDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? Script { get; set; }
        public int? Position { get; set; }
        public string? ReferenceImagePath { get; set; }
        public double? ReferenceLatitude { get; set; }
        public double? ReferenceLongitude { get; set; }
    }
}
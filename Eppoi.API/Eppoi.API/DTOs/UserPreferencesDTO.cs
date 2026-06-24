namespace Eppoi.API.DTOs
{
    public class UserPreferenceDto
    {
        public string Category { get; set; } = string.Empty;
        public string? SubType { get; set; }
        public double Weight { get; set; }
    }

    public class SavePreferencesRequestDto
    {
        public List<UserPreferenceDto> Preferences { get; set; } = [];
    }
}
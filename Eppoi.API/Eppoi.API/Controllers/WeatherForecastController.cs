using Eppoi.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eppoi.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [AllowAnonymous]
        [HttpPost("test-email")]
        public async Task<IActionResult> TestSendGrid([FromServices] IEmailService emailService, [FromQuery] string tuaEmailPersonale)
        {
            try
            {
                await emailService.SendEmailAsync(
                    toEmail: tuaEmailPersonale,
                    subject: "Test Integrazione SendGrid",
                    htmlBody: "<h1>Funziona!</h1><p>Il backend di Eppoi comunica correttamente con SendGrid tramite MailKit.</p>");

                return Ok(new { message = "Email inviata con successo al server SMTP!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Errore nell'invio", error = ex.Message });
            }
        }
    }
}

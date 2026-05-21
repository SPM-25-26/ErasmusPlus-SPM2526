using Eppoi.API.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Eppoi.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var email = new MimeMessage();

            var fromAddress = _config["EmailSettings:From"];

            if (string.IsNullOrEmpty(fromAddress))
                throw new InvalidOperationException("Email Sender address is missing in configuration.");

            email.From.Add(MailboxAddress.Parse(fromAddress));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();

            var host = _config["EmailSettings:Host"] ?? 
                throw new InvalidOperationException("Email Host is missing in configuration.");

            var user = _config["EmailSettings:User"] ??
                throw new InvalidOperationException("Email User is missing in configuration.");

            var password = _config["EmailSettings:Password"] ??
                throw new InvalidOperationException("Email Password is missing in configuration.");

            var portString = _config["EmailSettings:Port"] ?? "587";
            _ = int.TryParse(portString, out int port);

            await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(user, password);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
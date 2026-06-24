using Eppoi.API.DTOs;
using Eppoi.API.DTOs.Auth;
using Eppoi.API.Entities;
using Eppoi.API.Interfaces;
using Eppoi.API.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eppoi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IValidator<RegisterRequestDto> _registerValidator;
        private readonly IValidator<LoginRequestDto> _loginValidator;
        private readonly IValidator<ForgotPasswordRequestDto> _forgotPasswordValidator;
        private readonly IValidator<ResetPasswordRequestDto> _resetPasswordValidator;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(
            AppDbContext context,
            IPasswordHasherService passwordHasher,
            ITokenService tokenService,
            IEmailService emailService,
            IValidator<RegisterRequestDto> registerValidator,
            IValidator<LoginRequestDto> loginValidator,
            IValidator<ForgotPasswordRequestDto> forgotPasswordValidator,
            IValidator<ResetPasswordRequestDto> resetPasswordValidator,
            ILogger<AuthController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _emailService = emailService;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _resetPasswordValidator = resetPasswordValidator;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            _logger.LogInformation("Registration attempt started for username: {Username}, email: {Email}", request.Username, request.Email);

            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Registration validation failed for email: {Email}", request.Email);
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var existingUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Mail == request.Email || u.Username == request.Username);

            if (existingUser != null)
            {
                if (existingUser.Mail == request.Email)
                {
                    _logger.LogWarning("Registration failed: Email {Email} is already in use.", request.Email);
                    return Conflict(new { message = Consts.EmailExists });
                }

                if (existingUser.Username == request.Username)
                {
                    _logger.LogWarning("Registration failed: Username {Username} is already taken.", request.Username);
                    return Conflict(new { message = Consts.UsernameTaken });
                }
            }

            var newUser = new User
            {
                Name = request.Name,
                Surname = request.Surname,
                Username = request.Username,
                Mail = request.Email,
                Password = _passwordHasher.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
                HasCompletedFirstLogin = false,
                Verified = false,
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {Username} successfully registered with ID: {UserId}.", newUser.Username, newUser.Id);

            var verificationToken = _tokenService.GenerateEmailVerificationToken(newUser);

            var frontendBaseUrl = _configuration["FrontendUrls:BaseUrl"] ?? "http://localhost:3000";
            var verificationPath = _configuration["FrontendUrls:EmailVerificationPath"] ?? "/verify-email";
            var verificationLink = $"{frontendBaseUrl}{verificationPath}?token={verificationToken}";

            var emailBody = Consts.GetEmailVerificationBody(newUser.Username, verificationLink);

            try
            {
                _logger.LogInformation("Attempting to send verification email to {Email}", newUser.Mail);
                await _emailService.SendEmailAsync(newUser.Mail, Consts.EmailVerificationSubject, emailBody);
                _logger.LogInformation("Verification email successfully sent to {Email}", newUser.Mail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email to {Email}", newUser.Mail);
            }

            return StatusCode(StatusCodes.Status201Created, new { message = Consts.UserRegistered });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            _logger.LogInformation("Email verification attempt started.");

            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Email verification failed: Token is missing from the request.");
                return Content(Consts.HtmlMissingToken, "text/html");
            }

            var principal = _tokenService.ValidateToken(token);

            if (principal == null)
            {
                _logger.LogWarning("Email verification failed: Token validation returned null (expired or tampered).");
                return Content(Consts.HtmlInvalidToken, "text/html");
            }

            var purposeClaim = principal.FindFirst("purpose")?.Value;

            if (purposeClaim != Consts.PurposeEmailVerification)
            {
                _logger.LogWarning("Email verification failed: Invalid token purpose '{Purpose}'.", purposeClaim);
                return Content(Consts.HtmlInvalidTokenType, "text/html");
            }

            var userIdString = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                _logger.LogWarning("Email verification failed: Unable to parse User ID from token claims.");
                return Content(Consts.HtmlInvalidUserData, "text/html");
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("Email verification failed: User ID {UserId} was not found in the database.", userId);
                return Content(Consts.HtmlUserNotFound, "text/html");
            }

            if (user.Verified)
            {
                _logger.LogInformation("Email verification skipped: User {UserId} is already verified.", userId);
                return Content(Consts.HtmlEmailAlreadyVerified, "text/html");
            }

            user.Verified = true;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {UserId} successfully verified their email address.", userId);

            return Content(Consts.HtmlVerificationSuccess, "text/html");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            _logger.LogInformation("Login attempt started for identifier: {EmailOrUsername}", request.EmailOrUsername);

            var validationResult = await _loginValidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Login validation failed for identifier: {EmailOrUsername}", request.EmailOrUsername);
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Mail == request.EmailOrUsername || u.Username == request.EmailOrUsername);

            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.Password))
            {
                _logger.LogWarning("Login failed: Invalid credentials provided for identifier: {EmailOrUsername}", request.EmailOrUsername);
                return Unauthorized(new { message = Consts.InvalidCredentials });
            }

            if (!user.Verified)
            {
                _logger.LogWarning("Login failed: User {UserId} attempted to log in without verifying their email.", user.Id);
                return Unauthorized(new { message = Consts.EmailNotVerified });
            }

            var token = _tokenService.GenerateToken(user);
            if (!user.HasCompletedFirstLogin.HasValue || !user.HasCompletedFirstLogin.Value) user.HasCompletedFirstLogin = true;

            _logger.LogInformation("User {UserId} logged in successfully.", user.Id);

            return Ok(new
            {
                message = Consts.LoginSuccessful,
                token
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            _logger.LogInformation("Password reset request initiated for email: {Email}", request.Email);

            var validationResult = await _forgotPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Password reset request validation failed for email: {Email}", request.Email);
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Mail == request.Email);

            if (user == null)
            {
                _logger.LogWarning("Password reset request: Email {Email} does not exist. Generic success returned.", request.Email);
                return Ok(new { message = Consts.PasswordResetRequested });
            }

            var resetToken = _tokenService.GeneratePasswordResetToken(user);

            var frontendBaseUrl = _configuration["FrontendUrls:BaseUrl"] ?? "http://localhost:3000";
            var resetPath = _configuration["FrontendUrls:PasswordResetPath"] ?? "/reset-password";
            var resetLink = $"{frontendBaseUrl}{resetPath}?token={resetToken}";

            var emailBody = Consts.GetPasswordResetBody(user.Username, resetLink);

            try
            {
                _logger.LogInformation("Attempting to send password reset email to {Email}", user.Mail);
                await _emailService.SendEmailAsync(user.Mail, Consts.PasswordResetSubject, emailBody);
                _logger.LogInformation("Password reset email successfully sent to {Email}", user.Mail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", user.Mail);
            }

            return Ok(new { message = Consts.PasswordResetRequested });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            _logger.LogInformation("Password reset confirmation attempt started.");

            var validationResult = await _resetPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Password reset validation failed (likely weak password).");
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var principal = _tokenService.ValidateToken(request.Token);
            if (principal == null)
            {
                _logger.LogWarning("Password reset failed: Token is invalid or expired.");
                return BadRequest(new { message = Consts.InvalidResetToken });
            }

            var purposeClaim = principal.FindFirst("purpose")?.Value;
            if (purposeClaim != Consts.PurposePasswordReset)
            {
                _logger.LogWarning("Password reset failed: Invalid token purpose '{Purpose}'.", purposeClaim);
                return BadRequest(new { message = Consts.InvalidResetToken });
            }

            var userIdString = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                _logger.LogWarning("Password reset failed: Unable to parse User ID from token.");
                return BadRequest(new { message = Consts.InvalidResetToken });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("Password reset failed: User ID {UserId} not found in database.", userId);
                return BadRequest(new { message = Consts.InvalidResetToken });
            }

            user.Password = _passwordHasher.HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {UserId} successfully reset their password.", userId);

            return Ok(new { message = Consts.PasswordResetSuccess });
        }
    }
}
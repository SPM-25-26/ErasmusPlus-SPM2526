using Eppoi.API.DTOs.Auth;
using Eppoi.API.Entities;
using Eppoi.API.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IValidator<RegisterRequestDto> _validator;

        public AuthController(
            AppDbContext context,
            IPasswordHasherService passwordHasher,
            IValidator<RegisterRequestDto> validator)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _validator = validator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));

            var existingUser = await _context.Users
                .AsNoTracking() 
                .FirstOrDefaultAsync(u => u.Mail == request.Email || u.Username == request.Username);

            if (existingUser != null)
            {
                if (existingUser.Mail == request.Email)
                    return Conflict(new { message = "An account with this email already exists." });

                if (existingUser.Username == request.Username)
                    return Conflict(new { message = "This username is already taken." });
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

            return StatusCode(StatusCodes.Status201Created, new { message = "User registered successfully." });
        }
    }
}
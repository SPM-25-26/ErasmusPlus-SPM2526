using Eppoi.API.Entities;
using System.Security.Claims;

namespace Eppoi.API.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
        string GenerateEmailVerificationToken(User user);
        string GeneratePasswordResetToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
    }
}

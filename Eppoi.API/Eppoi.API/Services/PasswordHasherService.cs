using Eppoi.API.Interfaces;

namespace Eppoi.API.Services
{
    public class BCryptPasswordHasherService : IPasswordHasherService
    {
        public string HashPassword(string password) { return BCrypt.Net.BCrypt.HashPassword(password); }
        public bool VerifyPassword(string password, string passwordHash) { return BCrypt.Net.BCrypt.Verify(password, passwordHash); }
    }
}
using Eppoi.API.Entities;

namespace Eppoi.API.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}

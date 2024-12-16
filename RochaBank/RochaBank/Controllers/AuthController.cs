using Microsoft.AspNetCore.Mvc;
using RochaBank.DTO;
using RochaBank.Services;
using System.Data;

namespace RochaBank.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly ILogger<AuthController> _logger;
    public AuthController(ILogger<AuthController> logger)
    {
      _logger = logger;
    }

    [HttpPost("login")]
    [EndpointDescription("Aqui você poderá ter acesso ao token de autenticação, que te permitirá utilizar os endpoints desta API")]
    public async Task<ActionResult<dynamic>> AuthenticarLogin([FromBody] ContaBancariaLoginDTO model)
    {
      if (model.NumeroConta == "" || model.Senha == "")
        return NotFound(new { message = "Número da conta e/ou Senha não informados. Ambos campos são obrigatórios" });

      await using var db = new RochaBankContext();
      var user = db.contas.Where(conta => conta.NumeroConta == model.NumeroConta && conta.Senha == model.Senha).FirstOrDefault();

      if (user == null)
        return NotFound(new { message = "Número da conta ou senha estão incorretos" });

      var token = TokenService.GenerateToken(user);
      _logger.LogWarning(token);

      user.Senha = "";

      return new
      {
        user,
        token
      };
    }
  }
}

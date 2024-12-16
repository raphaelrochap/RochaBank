using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RochaBank.DTO;
using RochaBank.Models;

namespace RochaBank.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ContaBancariaController : ControllerBase
  {
    private readonly ILogger<ContaBancariaController> _logger;

    public ContaBancariaController(ILogger<ContaBancariaController> logger)
    {
      _logger = logger;
    }

    [HttpPost("cadastrar")]
    [EndpointDescription("Aqui voc� poder� cadastrar Contas Banc�rias no RochaBank.")]
    public async Task<IActionResult> Cadastrar([FromBody] ContaBancariaInputDTO conta)
    {
      await using var db = new RochaBankContext();
      Random numeroContaAleatorio = new Random();
      string numeroConta = numeroContaAleatorio.Next(1, 999999).ToString().PadLeft(6, '0');
      var novaConta = new ContaBancaria { NumeroConta = numeroConta,  Senha = conta.Senha, Nome = conta.Nome, Sobrenome = conta.Sobrenome, Saldo = 0 };

      db.contas.Add(novaConta);
      await db.SaveChangesAsync();

      novaConta.Senha = "";
      
      return Ok(new { message = "Conta banc�ria cadastrada com sucesso.", novaConta });
    }    

    [HttpDelete("deletar/{numeroconta}")]
    [EndpointDescription("Aqui voc� poder� remover uma Conta Banc�ria do RochaBank.")]
    public async Task<IActionResult> Deletar(string numeroconta)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == numeroconta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {numeroconta} n�o encontrada.");
        return NotFound(new { message = "N�o foi poss�vel encontrar sua conta banc�ria." });
      }

      db.contas.Remove(conta);
      await db.SaveChangesAsync();

      _logger.LogInformation($"Conta {numeroconta} removida com sucesso.");
      return Ok(new { message = "Conta banc�ria removida com sucesso.", conta });
    }

    [HttpPatch("deposito")]
    [Authorize]
    [EndpointDescription("Aqui voc� poder� depositar um valor em uma Conta Banc�ria do RochaBank.")]
    public async Task<IActionResult> Deposito([FromBody] ContaBancariaAlteraSaldoInputDTO contaParam)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == contaParam.NumeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {contaParam} n�o encontrada.");
        return NotFound(new { message = "N�o foi poss�vel encontrar sua conta banc�ria." });
      }

      conta.Saldo += contaParam.Valor;      

      db.contas.Update(conta);           
      await db.SaveChangesAsync();

      conta.Senha = "";
      return Ok(new { message = "Dep�sito realizado com sucesso.", conta });
    }

    [HttpPatch("saque")]
    [Authorize]
    [EndpointDescription("Aqui voc� poder� sacar um valor em uma Conta Banc�ria do RochaBank.")]
    public async Task<IActionResult> Saque([FromBody] ContaBancariaAlteraSaldoInputDTO contaParam)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == contaParam.NumeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {contaParam} n�o encontrada.");
        return NotFound(new { message = "N�o foi poss�vel encontrar sua conta banc�ria." });
      }

      if(conta.Saldo >= contaParam.Valor)      
        conta.Saldo -= contaParam.Valor;              
      else
        return BadRequest(new { message = "Saldo insuficiente para realizar o saque." });

      db.contas.Update(conta);
      await db.SaveChangesAsync();

      conta.Senha = "";

      return Ok(new { message = "Saque realizado com sucesso.", conta });
    }

    [HttpGet("verificarSaldo/{numeroConta}")]
    [Authorize]
    [EndpointDescription("Aqui voc� poder�, baseado em um valor, verificar o saldo de uma Conta Banc�ria do RochaBank.")]
    public async Task<IActionResult> VerificarSaldo(string numeroConta, double valor)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == numeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {numeroConta} n�o encontrada.");
        return NotFound(new { message = "N�o foi poss�vel encontrar sua conta banc�ria." });
      }

      if (conta.Saldo < valor)
        return BadRequest(new { message = "Saldo insuficiente para realizar saque deste valor." });      

      return Ok(new { message = "H� saldo dispon�vel em sua conta para esse valor.", conta });
    }
  }
}
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
    [EndpointDescription("Aqui você poderá cadastrar Contas Bancárias no RochaBank.")]
    public async Task<IActionResult> Cadastrar([FromBody] ContaBancariaInputDTO conta)
    {
      await using var db = new RochaBankContext();
      Random numeroContaAleatorio = new Random();
      string numeroConta = numeroContaAleatorio.Next(1, 999999).ToString().PadLeft(6, '0');
      var novaConta = new ContaBancaria { NumeroConta = numeroConta,  Senha = conta.Senha, Nome = conta.Nome, Sobrenome = conta.Sobrenome, Saldo = 0 };

      db.contas.Add(novaConta);
      await db.SaveChangesAsync();

      novaConta.Senha = "";
      
      return Ok(new { message = "Conta bancária cadastrada com sucesso.", novaConta });
    }    

    [HttpDelete("deletar/{numeroconta}")]
    [EndpointDescription("Aqui você poderá remover uma Conta Bancária do RochaBank.")]
    public async Task<IActionResult> Deletar(string numeroconta)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == numeroconta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {numeroconta} não encontrada.");
        return NotFound(new { message = "Não foi possível encontrar sua conta bancária." });
      }

      db.contas.Remove(conta);
      await db.SaveChangesAsync();

      _logger.LogInformation($"Conta {numeroconta} removida com sucesso.");
      return Ok(new { message = "Conta bancária removida com sucesso.", conta });
    }

    [HttpPatch("deposito")]
    [Authorize]
    [EndpointDescription("Aqui você poderá depositar um valor em uma Conta Bancária do RochaBank.")]
    public async Task<IActionResult> Deposito([FromBody] ContaBancariaAlteraSaldoInputDTO contaParam)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == contaParam.NumeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {contaParam} não encontrada.");
        return NotFound(new { message = "Não foi possível encontrar sua conta bancária." });
      }

      conta.Saldo += contaParam.Valor;      

      db.contas.Update(conta);           
      await db.SaveChangesAsync();

      conta.Senha = "";
      return Ok(new { message = "Depósito realizado com sucesso.", conta });
    }

    [HttpPatch("saque")]
    [Authorize]
    [EndpointDescription("Aqui você poderá sacar um valor em uma Conta Bancária do RochaBank.")]
    public async Task<IActionResult> Saque([FromBody] ContaBancariaAlteraSaldoInputDTO contaParam)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == contaParam.NumeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {contaParam} não encontrada.");
        return NotFound(new { message = "Não foi possível encontrar sua conta bancária." });
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
    [EndpointDescription("Aqui você poderá, baseado em um valor, verificar o saldo de uma Conta Bancária do RochaBank.")]
    public async Task<IActionResult> VerificarSaldo(string numeroConta, double valor)
    {
      await using var db = new RochaBankContext();
      var conta = await db.contas.FirstOrDefaultAsync(conta => conta.NumeroConta == numeroConta);

      if (conta == null)
      {
        _logger.LogWarning($"Conta {numeroConta} não encontrada.");
        return NotFound(new { message = "Não foi possível encontrar sua conta bancária." });
      }

      if (conta.Saldo < valor)
        return BadRequest(new { message = "Saldo insuficiente para realizar saque deste valor." });      

      return Ok(new { message = "Há saldo disponível em sua conta para esse valor.", conta });
    }
  }
}
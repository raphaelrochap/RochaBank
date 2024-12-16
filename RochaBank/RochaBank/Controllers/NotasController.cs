using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RochaBank.Models;
using RochaBank.Repositories;

namespace RochaBank.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class NotasController : ControllerBase
  {
    private readonly ILogger<NotasController> _logger;

    public NotasController(ILogger<NotasController> logger)
    {
      _logger = logger;
    }

    [HttpPost("inserirNotas")]
    [EndpointDescription("Aqui você poderá incluir no caixa eletrônico, notas para que o cliente possa sacar.")]
    public async Task<IActionResult> InserirNotas([FromBody] Notas notas)
    {
      await using var db = new RochaBankContext();
      var notasAtuais = await db.notas.FirstOrDefaultAsync(notas => notas.Id == "1");
      
      double totalValor = 0;
      if (notasAtuais != null)
        totalValor = notasAtuais.TotalReais;

      Notas novaNotas;

      if (notasAtuais == null)
      {
        novaNotas = new Notas()
        {
          Id = "1",
          Dois = notas.Dois,
          Cinco = notas.Cinco,
          Dez = notas.Dez,
          Vinte = notas.Vinte,
          Cinquenta = notas.Cinquenta,
          Cem = notas.Cem,
          Duzentos = notas.Duzentos,
          TotalReais = totalValor + (notas.Dois * 2) + (notas.Cinco * 5) + (notas.Dez * 10) + (notas.Vinte * 20) +
        (notas.Cinquenta * 50) + (notas.Cem * 100) + (notas.Duzentos * 200),
        };

        db.notas.Add(novaNotas);
      }
      else
      {
        notasAtuais.Dois += notas.Dois;
        notasAtuais.Cinco += notas.Cinco;
        notasAtuais.Dez += notas.Dez;
        notasAtuais.Vinte += notas.Vinte;
        notasAtuais.Cinquenta += notas.Cinquenta;
        notasAtuais.Cem += notas.Cem;
        notasAtuais.Duzentos += notas.Duzentos;
        notasAtuais.TotalReais += (notas.Dois * 2) + (notas.Cinco * 5) + (notas.Dez * 10) +
          (notas.Vinte * 20) + (notas.Cinquenta * 50) + (notas.Cem * 100) + (notas.Duzentos * 200);

        db.notas.Update(notasAtuais);
        novaNotas = notasAtuais;
      }
      await db.SaveChangesAsync();

      return Ok(new { message = "Notas inseridas no caixa com sucesso.", novaNotas });
    }

    [HttpPatch("removerNotas")]
    [Authorize]
    [EndpointDescription("Aqui você poderá remover notas do caixa eletrônico, logo após o usuário sacar.")]
    public async Task<IActionResult> RemoverNotas([FromBody] Notas notasDeSaque)
    {
      await using var db = new RochaBankContext();
      var notasAtuais = await db.notas.FirstOrDefaultAsync(notas => notas.Id == "1");
      
      if (notasAtuais == null)
        return NotFound(new { message = "Não existem notas cadastradas neste caixa" });

      notasAtuais.Dois -= notasDeSaque.Dois;
      notasAtuais.Cinco -= notasDeSaque.Cinco;
      notasAtuais.Dez -= notasDeSaque.Dez;
      notasAtuais.Vinte -= notasDeSaque.Vinte;
      notasAtuais.Cinquenta -= notasDeSaque.Cinquenta;
      notasAtuais.Cem -= notasDeSaque.Cem;
      notasAtuais.Duzentos -= notasDeSaque.Duzentos;
      notasAtuais.TotalReais = (notasAtuais.Dois * 2) + (notasAtuais.Cinco * 5) + (notasAtuais.Dez * 10) +
          (notasAtuais.Vinte * 20) + (notasAtuais.Cinquenta * 50) + (notasAtuais.Cem * 100) + (notasAtuais.Duzentos * 200);      

      db.notas.Update(notasAtuais);      
      await db.SaveChangesAsync();

      return Ok(new { message = "Notas removidas no caixa com sucesso.", notasAtuais });
    }

    [HttpGet("notasDisponiveis")]
    [Authorize]
    [EndpointDescription("Aqui você poderá listar para o usuários as escolhas de notas para ele sacar.")]
    public async IAsyncEnumerable<Notas?> NotasDisponiveis(double valor)
    {
      int qtdRetorno = 0;
      int[] cedulas = [200, 100, 50, 20, 10, 5, 2];
      Notas[] possibilidades = [];

      await using var db = new RochaBankContext();
      var notasAtuais = await db.notas.FirstOrDefaultAsync(notas => notas.Id == "1");

      if (notasAtuais == null)
        yield return null;

      foreach (var cedula in cedulas)
      {
        Notas? notas = NotasRepository.VerificarNotas(valor, cedula, notasAtuais);
        if (valor >= cedula && notas != null)
        {
          qtdRetorno++;
          yield return notas;
        }

        if (qtdRetorno == 3)
          break;
      }
    }

    [HttpGet("verificarNotasDoCaixa")]
    [EndpointDescription("Aqui você poderá mostrar ao cliente as notas existentes neste caixa eletrônico.")]
    public async Task<IActionResult> VerificarNotasDoCaixa()
    {
      await using var db = new RochaBankContext();
      var notasAtuais = await db.notas.FirstOrDefaultAsync(notas => notas.Id == "1");

      return Ok(new { message = "Essas são as notas disponíveis.", notasAtuais });
    }
  }
}

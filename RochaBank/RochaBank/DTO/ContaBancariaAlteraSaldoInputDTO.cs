using System.ComponentModel.DataAnnotations;

namespace RochaBank.DTO
{
  public class ContaBancariaAlteraSaldoInputDTO
  {
    public required string NumeroConta { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "O valor não pode ser negativo.")]

    public double Valor { get; set; }
  }
}

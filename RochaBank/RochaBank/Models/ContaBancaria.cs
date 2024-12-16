using System.ComponentModel.DataAnnotations;

namespace RochaBank.Models
{  
  public class ContaBancaria
  {
    [Key]
    
    public required string NumeroConta { get; set; }
    public required string Nome { get; set; }

    public required string Senha { get; set; }

    public required string Sobrenome { get; set; }
    
    public double Saldo { get; set; }
  }
}

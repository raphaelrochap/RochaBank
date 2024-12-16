using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RochaBank.Models
{
  public class Notas
  {
    [Key]
    [JsonIgnore]
    public string? Id { get; set; }
    public int Dois { get; set; }
    public int Cinco { get; set; }
    public int Dez { get; set; }
    public int Vinte { get; set; }
    public int Cinquenta { get; set; }
    public int Cem { get; set; }
    public int Duzentos { get; set; }

    [JsonIgnore]
    public double TotalReais { get; set; }
  }
}

using Microsoft.EntityFrameworkCore;
using RochaBank.Models;

namespace RochaBank
{
  public class RochaBankContext : DbContext
  {
    public DbSet<ContaBancaria> contas { get; set; }
    public DbSet<Notas> notas { get; set; }
    public string DbPath { get; }

    public RochaBankContext()
    {
      DbPath = "RochaBank.db";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
      => optionsBuilder.UseSqlite($"Data Source={DbPath}");

  }
}

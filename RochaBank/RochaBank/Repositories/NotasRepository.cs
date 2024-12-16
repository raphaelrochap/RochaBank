using RochaBank.Models;

namespace RochaBank.Repositories
{
  public static class NotasRepository
  {
    public static Notas? VerificarNotas(double valor, int nota, Notas? notasAtuais)
    {
      if (notasAtuais == null) return null;

      double valorASerDividido = valor;
      int porDuzentos = 0;
      int porCem = 0;
      int porCinquenta = 0;
      int porVinte = 0;
      int porDez = 0;
      int porCinco = 0;
      int porDois = 0;

      switch (nota)
      {
        case 200:
          if (notasAtuais.Duzentos == 0 && valor == 200) return null;
          porDuzentos = (int)(valorASerDividido / 200);
          if (notasAtuais.Duzentos <= porDuzentos && notasAtuais.Duzentos >= 0)
            porDuzentos = notasAtuais.Duzentos;

          valorASerDividido -= (porDuzentos * 200);
          goto case 100;
        case 100:
          if (notasAtuais.Cem == 0 && valor == 100) return null;
          porCem = (int)(valorASerDividido / 100);
          if (notasAtuais.Cem <= porCem && notasAtuais.Cem >= 0)
            porCem = notasAtuais.Cem;

          valorASerDividido -= (porCem * 100);
          goto case 50;
        case 50:
          if (notasAtuais.Cinquenta == 0 && valor == 50) return null;
          porCinquenta = (int)(valorASerDividido / 50);
          if (notasAtuais.Cinquenta <= porCinquenta && notasAtuais.Cinquenta >= 0)
            porCinquenta = notasAtuais.Cinquenta;

          valorASerDividido -= (porCinquenta * 50);
          goto case 20;
        case 20:
          if (notasAtuais.Vinte == 0 && valor == 20) return null;
          porVinte = (int)(valorASerDividido / 20);
          if (notasAtuais.Vinte <= porVinte && notasAtuais.Vinte >= 0)
            porVinte = notasAtuais.Vinte;

          valorASerDividido -= (porVinte * 20);
          goto case 10;
        case 10:
          if (notasAtuais.Dez == 0 && valor == 10) return null;
          porDez = (int)(valorASerDividido / 10);
          if (notasAtuais.Dez <= porDez && notasAtuais.Dez >= 0)
            porDez = notasAtuais.Dez;

          valorASerDividido -= (porDez * 10);
          goto case 5;
        case 5:
          if (notasAtuais.Cinco == 0 && valor == 5) return null;
          porCinco = (int)(valorASerDividido / 5);
          if (notasAtuais.Cinco <= porCinco && notasAtuais.Cinco >= 0)
            porCinco = notasAtuais.Cinco;

          valorASerDividido -= (porCinco * 5);
          goto case 2;
        case 2:
          if (notasAtuais.Dois == 0 && valor == 2) return null;
          porDois = (int)(valorASerDividido / 2);
          if (notasAtuais.Dois <= porDois && notasAtuais.Dois >= 0)
            porDois = notasAtuais.Dois;

          valorASerDividido -= (porDois * 2);
          break;
      }

      if ((porDuzentos * 200) + (porCem * 100) + (porCinquenta * 50) + (porVinte * 20) + (porDez * 10) +
        (porCinco * 5) + (porDois * 2) == valor)
      {
        return new Notas()
        {
          Duzentos = porDuzentos,
          Cem = porCem,
          Cinquenta = porCinquenta,
          Vinte = porVinte,
          Dez = porDez,
          Cinco = porCinco,
          Dois = porDois,
        };
      }

      return null;
    }
  }
}

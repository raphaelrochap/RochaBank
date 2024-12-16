# RochaBank
O RochaBank é um sistema de caixa eletrônico. O intuito é simular um caixa eletrônico e com isso foi feito um releitura do mesmo em um ambiente web.
Você percebrá que em dados momentos é usado o termo 'retire o cartão' apenas para fazer um brincadeira com os Caixas Eletrônicos existentes.

O projeto consiste em um backend feito em C# Net Core (para aplicações REST API), o frontend feito em React com NextJS e banco de dados SQLite.
Abaixo entenderá como fazer para rodar ambos e poder testar a aplicação. 

## Backend

Abra o projeto no Visual Studio, rode o Nuget para que ele baixe as dependências do projeto, são elas:

- Microsoft.AspNetCore.Authentication
- Microsoft.AspNetCore.Authentication.JwtBearer
- icrosoft.EntityFrameworkCore.Sqlite
- Swashbuckle.AspNetCore

### Rodando a API

Para isso basta compilar a solução (F6) e executá-la (F5).

## Frontend

O frontend é um projeto em React Typescript com a biblioteca NextJS, sendo útil aqui para facilitar a criação de rotas. Foi utilizado também o ChakraUI como biblioteca de componentes visuais, Axios para requisições à API REST, Zustand como gerenciador de estados e React Icons para utilização de ícones. Em resumo foram utilizadas as seguintes bibliotecas:

- NextsJS
- ChakraUI
- Axios
- Zustand

### Rodando a aplicação frontend

Após baixar este repositório, no projeot frontend rodar os seguintes comandos:

Instalar dependências:
```bash
npm install 
```

Subir o site:
```bash
npm run dev 
```

## Considerações a cerca do projeto

Dentro da pasta do backend já existe o arquivo de banco de dados criado, o 'RochaBank.db', dentro ele já possui uma conta configurada e um caixa com algumas notas dentro. Caso queira criar Contas Bancárias novas para teste prório, basta usar o endpoint '/ContaBancaria/cadastrar'. E caso queita inserir notas no caixa eletrônico basta usar o endpoint '/Notas/inserirNotas'. Todos os endpoint possuem descrição no Swagger para mais fácil compreensão. A aplicação permite fazer as 3 operações básicas, Depositar, Sacar e ver Saldo. No Saque será possível o usuários ver as notas disponíveis no caixa e ao selecionar o valor e avançar o mesmo poderá ver quais possibilidades de notas a se sacar. Caso o mesmo não possua saldo, o sistem o impedirá de prosseguir e o mesmo acontece caso o valor solicitado não seja compatível com as notas em circulação e/ou as notas disponíveis no caixa não sejam o suficiente para que o mesmo possa sacar o valor desejado, ainda que tenha saldo. Ao clicar em ver Saldo, o mesmo poderá ver o seu saldo atual. Ao fazer o depósito nenhuma validação é feita, o valor escolhido é inserido direto no saldo da conta (destaco que o depósito não interfere na quantidades de notas existentes no caixa, isso deve ser feito numa requisição À parte utilizando Insomnia, Postman ou outro sistema de Requisições API REST de preferência). Por fim a opção Sair apenas retira do estado global da aplicação o Token de acesso a APi para que assim o usuário tenha que relogar.
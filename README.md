# RochaBank
O RochaBank é um sistema de caixa eletrônico. O intuito é simular um caixa eletrônico e com isso foi feito uma releitura do mesmo em um ambiente Web.
Você perceberá que em dados momentos é usado o termo 'retire o cartão' apenas para fazer um brincadeira com os Caixas Eletrônicos existentes.

O projeto consiste em um backend feito em C# Net Core (para aplicações REST API), o frontend feito em React com NextJS e banco de dados SQLite.
Abaixo entenderá como fazer para rodar ambos e poder testar a aplicação. 

## Backend

Abra o projeto no Visual Studio, atualize as dependências com o Nuget, são elas:

- Microsoft.AspNetCore.Authentication
- Microsoft.AspNetCore.Authentication.JwtBearer
- icrosoft.EntityFrameworkCore.Sqlite
- Swashbuckle.AspNetCore

### Rodando a API

Para isso basta compilar a solução (F6) e executá-la (F5).

## Frontend

O frontend é um projeto em React Typescript com a biblioteca NextJS, sendo útil aqui para facilitar a criação de rotas. Foi utilizado também o ChakraUI como biblioteca de componentes visuais, Axios para requisições à API REST, Zustand como gerenciador de estados, React Icons para utilização de ícones e Typescript para facilitar a tipagem durante o desenvolvimento evitando que erros de conversão e/ou tipagem acontecam. Em resumo foram utilizadas as seguintes bibliotecas:

- NextsJS
- ChakraUI
- Axios
- Zustand
- React Icons
- Typescript

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

## Banco de dados

Foi escolhido o SQLite por ser um banco leve, torna mais fácil para quem for testar esta aplicação.
O Banco possui duas tabelas:

- contas: Representa as Contas Bancárias existentes no RochaBank, ela indica o número da conta, informações do dono da conta, senha e saldo.
- notas: Representa o caixa eletrônico e possui informações de todas as notas existentes neste caixa eletrônico, bem como o valor total em reais referente ao total das notas contidas.  

## Considerações a cerca do projeto

### Considerações do Backend 
Dentro da pasta do backend já existe o arquivo de banco de dados criado, o 'RochaBank.db', dentro ele já possui uma conta configurada e um caixa com algumas notas dentro. Caso queira criar Contas Bancárias novas para teste prório, basta usar o endpoint '/ContaBancaria/cadastrar'. E caso queita inserir notas no caixa eletrônico basta usar o endpoint '/Notas/inserirNotas'. Você também pode manipular diretamente o banco de dados caso queira. Todos os endpoint possuem descrição no Swagger para mais fácil compreensão.

É importante destacar que esta API possui Autenticação, então só é possível utilizar as rotas utilizando um token de acesso que é possível pegar apenas na requisição de '/login', onde será disponibilixado um Bearer Token.

### Considerações do Frontend 

A aplicação permite fazer as 3 operações básicas, Depositar, Sacar e ver Saldo e também Login e Logout:
- No Saque será possível o usuários ver as notas disponíveis no caixa e ao selecionar o valor e avançar o mesmo poderá ver quais possibilidades de notas a se sacar. Caso o mesmo não possua saldo, o sistem o impedirá de prosseguir e o mesmo acontece caso o valor solicitado não seja compatível com as notas em circulação e/ou as notas disponíveis no caixa não sejam o suficiente para que o mesmo possa sacar o valor desejado, ainda que tenha saldo.

- Ao clicar em ver Saldo, o mesmo poderá ver o seu saldo atual.

- Ao fazer o depósito nenhuma validação é feita, o valor escolhido é inserido direto no saldo da conta (destaco que o depósito não interfere na quantidades de notas existentes no caixa, isso deve ser feito numa requisição à parte utilizando Insomnia, Postman ou outro sistema de Requisições API REST de preferência).

- A opção Sair apenas retira do estado global da aplicação o Token de acesso a APi para que assim o usuário tenha que relogar.

- A tela de Login pede ao usuário um Número de Conta e Senha, ao passar informações corretas o usuário será redirecionado para a tela principal para escolher a opção desejada.

A cerca das proteções, alem de proteções de valor e de saque para que o usuário não possa sacar valores que não possui de salo ou valores que a caixa não possui temos proteções de acesso às páginas, não é possível utilizar o site (em nenhuma das rotas) caso um login não tenha sido realizado. Informo também que essa sessão será desfeita caso o usuário atualize a página ou feche a aba/navegador.

## Sobre o algorítmo de possibilidades de notas

Escolhi uma abordagem na escolha das notas que é a seguinte:

Ao solicitar um valor, o sistema irá verificar se existem notas de 200, caso não tenha ele seguirá a validação (seguindo a ordem: 200, 100, 50, 20,10, 5, 2) até encontrar uma que possua notas no caixa, quando isso acontecer ele tentar pegar o máximo de notas daquele valor que puder e a parte fracionada, que falta desses que foi encontrado irão ser procuradas nas notas inferiores. E isso é feito em loop, para que a cada nova possibilidades de notas uma seja descartada, fazendo assim que o usuário tenha algumas possibilidades de notas diferentes. Dependendo da quantidade de notas e dos valores, poderiamos ter aqui até 7 possibilidades de escolhas de notas, ainda que uma delas sejam apenas notas de 2 Reais.
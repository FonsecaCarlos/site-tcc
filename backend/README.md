# Projeto backend do site

O projeto foi construido utilizando o [Node.JS](https://nodejs.org/en/) e o [MongoDB](https://www.mongodb.com/). Para execulá-lo em seu computador baixe o repositório e dentro do diretório /backend execute os seguintes comandos:

```
$ npm install
```
Com esse comando serão instaladas as dependências do projeto.


O [MongoDB](https://www.mongodb.com/) foi utilizado através do [Docker](https://www.docker.com/). Ele é uma tecnologia de software que fornece contêineres, promovido pela empresa Docker, Inc. Ele fornece uma camada adicional de abstração e automação de virtualização de nível de sistema operacional no Windows e no Linux. Após instalá-lo, execute os seguintes comando no terminal:

```
$ docker run --name mongoDB-tcc -p 27017:27017 -d mongo
$ docker ps
```

**`Atenção: ` Os comandos acima devem ser excutados apenas uma vez, quando for iniciar o serviço do MongoDB pelo Docker nas próximas vezes utilize os comandos a seguir: (o primeiro lista todas os containers do seu sistema e o segundo inicia um conteiner específico)**

```
$ docker ps -a
$ docker start mongoDB-tcc
```

Por fim, depois execute:

```
$ npm run dev
```

**Para que este projeto execute completamente em sua máquina é preciso que o serviço `frontend` também esteja em funcinamento. Caso queira realizar testes, apoś executar todos os comandos acima o backend já está preparado para ser testado por aplicativos como o Insomnia ou Postman**

## DESENVOLVIMENTO DO BACKEND

O termo backend vem do inglês e, em uma tradução direta, significa “parte do fundo”. Dentro do contexto de desenvolvimento web se refere à parte da aplicação que é executada no lado do servidor, ou seja, faz referência à parte não visível de um site. O backend, além de ser composto por todo o código que é executado no lado do servidor, é composto também pelo banco de dados. Desse modo, pode-se garantir a integridade e veracidade das informações salvas, haja visto que todas as informações do bando devem passar pela validação do servidor.

Para salvar os dados foi utilizado o MongoDB, conectado a um servidor Node.js. O MongoDB é um banco de dados orientado a documentos, possui código aberto e é classificado como banco de dados NoSQL. Optou-se por esse Sistema Gerenciador de Bancos de Dados (SGBD) porque ele modela informações de modo mais natural e fácil de buscar.

Na base de dados criada existem duas coleções: a primeira guarda os dados do usuário e a segunda dos textos, nomeadas de User e NarrativeText, respectivamente. A primeira coleção salva o nome, e-mail e senha do usuário e a segunda salva o autor, data de criação, título, texto, status, se é pública, se é primária, os textos alternativos, qual é a história primária e quem curtiu o texto.

Essa é a estrutura dos objetos salvos no MongoDB. Apenas o servidor possui autorização para acessar e alterar essas informações. O servidor foi desenvolvido com o NodeJS, um interpretador de código JavaScript, com código aberto, de modo assíncrono e orientado a eventos, focado em migrar a programação do Javascript do lado do cliente para os servidores. Com ele é possível criar aplicações de alta escalabilidade, capazes de manipular milhares de requisições simultâneas em tempo real, numa única máquina física.

Dentro do servidor NodeJS, foi utilizado o Express, ele é um software livre e de código aberto. Foi projetado para construir aplicativos para Web e APIs. É conhecido como o framework backend padrão para o NodeJS. Ele foi escolhido para esse projeto pois cria abstrações de rotas, middlewares  e muitas outras funções para facilitar a criação de uma API .

Dentro do servidor foram criadas duas APIs – openApi e protectedApi, uma aberta e outra protegida, respectivamente. Dentro de openApi foram criadas cinco rotas, a primeira para autenticação do usuário “/login”, a segunda para a criação de uma nova conta “/signup”, a terceira para validar o token do usuário “/validateToken”, a quarta para quando o usuário esquecer a senha “/forgotPassword” e a quinta rota para resetar a senha do usuário “/resetPassword”. Caso o usuário esqueça sua senha de acesso é possível recuperá-la, para isso ele deve informar seu e-mail e a aplicação enviará para ele um token com validade de uma hora. Se o usuário não realizar a alteração dentro do prazo de validade será necessário solicitar um novo token para completar a ação.

Para acessar a API protegida, é necessário possuir um token fornecido pela API aberta; sem ele não é possível invocar os métodos do servidor, tornando assim a aplicação mais segura.

Na API protegida existem nove rotas que podem ser chamadas pelo usuário e cada rota faz referência a uma ação diferente.

- index – Rota de paginação, em que são retornadas todas as histórias de um determinado autor. 
- indexPublic – Rota de paginação, em que são retornadas todas as histórias públicas e primárias.
- indexHistory – Rota do tipo GET, que retorna uma história.
- addAlternativeText – Rota do tipo POST, que cria uma nova história.
- searchHistory – Rota de paginação, em que são retornadas todas as histórias públicas e todas do autor com o título pesquisado.
- putHistory – Rota do tipo PUT, que altera uma história.
- addLike – Rota do tipo PUT, que adiciona uma curtida para a história.
- removeLike – Rota do tipo PUT, que remove uma curtida da história.
- deleteHistory – Rota do tipo DELETE, que exclui uma história, se a ação for solicitada pelo autor e se ela não tiver nenhum enredo alternativo.

Para a paginação, inicialmente foi utilizado o plugin mongoosePaginate. O problema é que ele retorna os dados de apenas uma coleção, e não permite fazer agregações. Como solução foi necessário utilizar outro plugin, o mongooseAggregatePaginate. Com ele é possível criar consultas complexas entre diversas coleções e retorná-las em uma paginação.

Nas paginações são adicionados um campo isAuthor, para saber se ele é o dono da história, um campo liked, para saber se o texto já foi curtido ou não, e um campo likes com a quantidade de curtidas. Os campos de textos alternativos, status, id, e-mail e senha do autor são omitidos no retorno para gerar mais segurança aos dados.

Para gerar mais segurança ao sistema, foi utilizado o plugin bcrypt, responsável por criptografar a senha do usuário com o intuito de tornar o acesso mais seguro. O plugin responsável por gerar o token é o jsonwebtoken; cada token possui a validade de 24 horas e após esse período é necessário realizar novamente a autenticação. 

A conexão do servidor NodeJS com o banco de dados MongoDB é realizada através da biblioteca do Mongoose. Ela é responsável por modelar os dados baseado no esquema das coleções, que nesse projeto são os modelos User e NarrativeText, já mensionados. Com ela são feitas as conversões, validações e consultas da aplicação.
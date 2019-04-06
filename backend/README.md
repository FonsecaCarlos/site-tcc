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
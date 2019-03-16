const server =  require('./config/server')

require('./config/database')

require('./config/routes')(server)

/*
    Comandos:
    docker run --name mongoDB-tcc -p 27017:27017 -d mongo
    docker ps
    docker ps -a
    docker start mongoDB-tcc
*/
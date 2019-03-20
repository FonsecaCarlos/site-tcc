## site-tcc

# SITE PARA PRODUÇÃO DE TEXTOS NARRATIVOS COM ENREDOS ALTERNATIVOS



### 1 Resumo

Este projeto tem como objetivo o desenvolvimento de um sistema Web que ofereça um ambiente para a produção de textos narrativos, na forma de estórias que tenham enredos alternativos, isto é, em que o leitor possa decidir o “caminho a seguir” dentro da estória. Assim, espera-se que o software seja uma ferramenta de estímulo para o exercício da escrita, da leitura e da criatividade em sala de aula, mediado pelo professor, de forma que estórias com enredos alternativos sejam escritas de maneira cooperativa e colaborativa, a exemplo dos sistemas Wiki. Na aplicação que pretendemos criar, os autores das estórias poderão compartilhar seus textos com outros autores, que por sua vez, podem alterar o desenrolar da narrativa. Assim, o leitor poderá escolher qual tipo de final prefere ler. Desse modo, espera-se dar mais estímulo à leitura, visto que podemos ter mais de uma estória em um mesmo texto.

### 2 OBJETIVOS

##### 2.1 Objetivo Geral

Desenvolver um sistema Web que ofereça um ambiente para a produção de textos narrativos, na forma de estórias que tenham enredos alternativos, para promover a leitura e a escrita de textos.

##### 2.2 Objetivos Específicos

* Fazer uma revisão bibliográficas em busca ideias correlatas;
* Construir a modelagem do sistema;
* Desenvolver a aplicação;
* Realizar os testes;
* Disponibilizar para os usuários.

### 3 PERCURSO METODOLÓGICO

##### 3.1 Modelagem e Desenvolvimento do Site

Em um primeiro momento foi realizado o levantamento bibliográfico nos sites [BDTD](http://bdtd.ibict.br/vufind/), [Scielo](http://www.scielo.org/php/index.php) e [Google Acadêmico](https://scholar.google.com.br/) em busca de trabalhos de conclusão de curso semelhantes, mas não foi encontrada até o momento nenhum material semelhante ao proposto aqui.
Em seguida, foi realizada a prototipação das telas do sistema utilizando o [Adobe XD](https://www.adobe.com/br/products/xd.html), optou-se por iniciar pela prototipação das telas para melhor elucidação dos requisitos do sistema.
A ferramenta [Adobe XD](https://www.adobe.com/br/products/xd.html), foi lançada pela [Adobe Systems](https://www.adobe.com/br/) em dezembro 2016, é um aplicativo de design de experiência do usuário. Ela suporta design vetorial e wireframing – um guia visual que representa o esqueleto de um website –, além de criar protótipos de cliques interativos simples, esse é o principal motivo pelo qual optamos por utiliza-la.
Após esta prototipação das interfaces foram levantados os requisitos funcionais e não funcionais. Os requisitos funcionais auxiliam na declaração dos serviços ou funções que o sistema deve fornecer, de como o sistema deve reagir as entradas específicas e de como o sistema deve se comportar em determinadas situações, já os não funcionais servem para restringir os serviços ou funções oferecidas pelo sistema, essas restrições são no processo de desenvolvimento e nas normas de funcionamento.
Concluído esse levantamento, elaboramos o diagrama dos casos de uso na ferramenta [Astah Community](http://astah.net/editions/community), lançada em setembro de 2009 pela [ChangeVision, Inc](http://www.change-vision.com/index_en.html), ela é uma ferramenta de modelagem UML (Linguagem de Modelagem Unificada). Após o diagrama de casos de uso, elaboramos o diagrama de classes, também na ferramenta [Astah Community](http://astah.net/editions/community), com função de representar a estrutura de estática do sistema, apresentando suas classes, atributos, operações e as relações entre os objetos.
O diagrama de casos de uso possui o propósito de identificar os atores envolvidos em uma interação, é uma técnica eficaz para elucidar requisitos que vão interagir diretamente com o sistema. Com esses digramas finalizados, foram construídos os cenários dos casos de uso. De acordo com SOMMERVILLE, 2011, os cenários de caso são fluxos que compõem a especificação do caso de uso, indicam o que ocorre em cada um.
A próxima etapa a ser inicializada será a implementação. Para isso utilizaremos o [React](https://reactjs.org/), ele é uma biblioteca JavaScript de código aberto para criar interfaces de usuário. É mantido pelo [Facebook](https://www.facebook.com/), [Instagram](https://www.instagram.com/?hl=pt-br) e uma comunidade de desenvolvedores. Optamos por essa biblioteca pois com ela é possível criar aplicações com um bom desempenho de atualização de componentes. O [React](https://reactjs.org/) permite que manipulemos estado e propriedades da página, enquanto ele se
encarrega de atualizar a interface do usuário, sem precisar carregar todo o conteúdo novamente.
Para salvar os dados utilizaremos o [MongoDB](https://www.mongodb.com/), instalado em um servidor [Node.js](https://nodejs.org/en/). O [MongoDB](https://www.mongodb.com/) é um banco de dados orientado a documentos, ele possui código aberto e é classificado como banco de dados NoSQL. Optamos por essa ferramenta porque ela modela informações de modo mais natural e fáceis de buscar.
Posteriormente serão realizados os testes e disponibilizado o site para comunidade acadêmica.


### 4 CONSIDERAÇÕES FINAIS

Este documento possui caráter dinâmico, de forma a se adaptar conforme eventuais mudanças nos requisitos levantados, ou na substituição de alguma tecno- logia utilizada para implementação. O objetivo deste documento é o de servir como orientação para desenvolvimento de uma aplicação que estimule a produção de tex- tos, por isso, foi estruturado e escrito de forma simples, sucinta e objetiva, a fim de que seja constantemente consultado e sirva ao propósito de nortear a construção do software.
Cabe ressaltar que o site produzido deve ser usado por professores das redes de ensino (municipal, estadual e federal) como ferramenta de auxílio na produção de textos narrativos.

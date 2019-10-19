# Projeto frontend do site

O projeto foi construido utilizando o [React](https://reactjs.org/) e o [Redux](https://redux.js.org/). Para execulá-lo em seu computador baixe o repositório e dentro do diretório /frontend execute os seguintes comandos:

```
$ npm install
```

Com esse comando serão instaladas as dependências do projeto, depois execute:

```
$ npm start
```

**Para que este projeto execute em sua máquina é preciso que o serviço `backend` também esteja em funcinamento**

## DESENVOLVIMENTO DO FRONTEND

O termo frontend vem do inglês, em uma tradução direta significa “parte da frente”, e dentro do contexto de desenvolvimento web se refere à parte da aplicação que interage diretamente com o usuário final, ou seja, faz referência à parte visível de um site. O frontend é composto por todo o código que é executado no lado do cliente, dentro do navegador do usuário. Desse modo, ele vai além das telas, botões, imagens, campos de entrada e formulários, sendo composto também por validações, tratamento de erros, etc. 
Para a implementação dessa parte do projeto, foi realizada primeiramente a prototipação das telas do sistema, utilizando o Adobe XD (ADOBE, 2016). Optou-se por iniciar pela prototipação das telas para melhor elucidação dos requisitos do sistema.

A ferramenta Adobe XD, lançada pela Adobe Systems em dezembro 2016, é um aplicativo de design de experiência do usuário. Ela suporta design vetorial e wireframing – um guia visual que representa o esqueleto de um website –, além de criar protótipos de cliques interativos simples; esses são os principais motivos pelos quais se optou pela sua utilização.

No desenvolvimento do projeto de interfaces foram escolhidas cores neutras, evitou-se cores quentes, como vermelho, laranja e amarelo; foram escolhidas tons derivados de verde e azul. O objetivo aqui não é avaliar os efeitos e emoções que as cores podem transmitir, contudo elas foram selecionadas com base em suas capacidades de influência: o verde emana o instinto de algo natural e orgânico, o que faz com que seja uma cor agradável aos olhos e por estar relacionada à uma sensação de relaxamento, harmonia e segurança; o azul foi escolhido por transmitir sensação de paz e confiança, ela é uma das cores mais comuns na web, inconscientemente diminui o apetite, o que pode ajudar os escritores a manter o foco no texto em produção (REIS, 2016).

A próxima etapa a ser iniciada foi a de implementação. Para isso foi utilizado o React, uma biblioteca JavaScript de código aberto para criar interfaces de usuário. É mantido pelo Facebook, Instagram e uma comunidade de desenvolvedores. Optou-se por essa biblioteca, pois com ela é possível criar aplicações com um bom desempenho de atualização de componentes. O React permite que sejam manipulados o estado e as propriedades da página, enquanto ele se encarrega de atualizar a interface do usuário, sem precisar carregar todo o conteúdo novamente.

Para que seja criado um site com React é necessário usar a Linguagem de Marcação de Hipertexto – em inglês Hypertext Markup Language (HTML), a linguagem de estilização Folha de Estilo em Cascatas – em inglês Cascading Style Sheets (CSS) – e a linguagem de programação JavaScript.
O HTML, criado originalmente por Tim Berners-Lee em 1990, define a estrutura e a marcação das páginas web e é interpretada pelos navegadores. Suas tags possuem valor semântico, o que dá sentido aos textos escritos dentro delas, os quais serão exibidos para o usuário.

O CSS é usado para estilizar os elementos escritos com HTML. Com ele é possível alterar a cor do texto, do fundo do texto, tipo e tamanho de fontes, espaçamento entre parágrafos, etc. O CSS foi desenvolvido pelo World Wide Web Consortium (W3C) em 1996, para suprir a necessidade de decorar o HTML, que não foi projetado para ter tags que formatem a página.

O JavaScript é uma linguagem de programação interpretada de alto nível, caracterizada també, como dinâmica, fracamente tipada e multi-paradigma. Ele foi criado em 1995, pela empresa norte americana Netscape Communications, fundada em 1994. Juntamente com HTML e CSS, o JavaScript é uma das três principais tecnologias da World Wide Web. Ele permite criar páginas interativas e, portanto, é uma parte essencial dos aplicativos da web.

Juntamente com o React, foi também utilizado o Redux. Ele é uma biblioteca JavaScript de código aberto que gerencia o estado de uma aplicação. Assim, retira-se o estado dos componentes do React para facilitar a escrita e manutenção do código desenvolvido. O Redux, que é uma pequena biblioteca com uma API simples e opera com o conceito de programação funcional, cria um estado geral para os componentes do React consumirem essas informações.

Juntamente com o Redux foram utilizados os plugins redux-form, redux-multe, redux-promise e redux-thunk, cujo propósito é facilitar o gerenciamento de formulários, ações múltiplas, Promises e ações assíncronas, respectivamente. O último plugin utilizado com o Redux foi o react-redux-toastr, que exibe mensagens para o usuário, tanto as de sucesso como também as de erros.

A navegação entre as telas é gerenciada pelo plugin react-router-dom, que cria rotas a partir do mapeamento dos componentes do React. Essa aplicação possui quatro rotas. A primeira está mapeada para o caminho “/”; caso o usuário não esteja autenticado será exibido o formulário de autenticação; caso o usuário não tenha uma conta será exibido um formulário de cadastro ou, se ele já estiver autenticado, será exibida a tela inicial com as histórias públicas.

Ao clicar sobre uma história, o usuário é redirecionado para a segunda rota, a qual está mapeada para o caminho “/readhistory”. Nela é possível ler, curtir e adicionar um enredo alternativo. Caso o usuário autenticado seja o autor da história selecionada, é exibido uma opção para alterá-la; se a história não tiver nenhum enredo alternativo será exibido também uma opção para excluí-la.

A terceira rota é “/writehistory”, cuja função é permitir que o usuário altere um texto. Existem duas maneiras para chegar nela: na primeira é preciso passar pela quarta rota “/createhistory”, em que é criada uma nova história, que pode ser um texto alternativo ou não. Se o usuário chegar na quarta rota a partir da primeira, é criada uma nova história; se ele chegar a partir da segunda é criado um enredo alternativo. 

Em ambos os casos os textos estarão em branco, contendo apenas o título, data de criação e autor. A segunda maneira de chegar na terceira rota é pela segunda rota e, nesse caso, o autor poderá editar um texto já salvo no banco de dados.

Na área de edição dos textos é possível formatar os textos escritos – alterar cor, tamanho, espaçamento, fonte, alinhamento, etc; tais ferramentas são provenientes de um plugin do primereact. Com ele é possível estilizar o texto e adicionar imagens para personalizar uma história. O funcionamento desse plugin depende de um terceiro, quill, e é ele que, em realidade, efetua todas as alterações.
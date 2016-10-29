[Trabalho em desenvolvimento]

# Microcefalia
Tratamento e visualização de dados sobre microcefalia no Brasil

## Dados
A base de dados utilizada é oficial e está disponível no site da [Sala de Apoio à Gestão Estratégica do Ministério da Saúde](http://sage.saude.gov.br/), mais especificamente através do botão `Lista microcefalia` no [painel](http://sage.saude.gov.br/?link=microcefalia&flt=true&param=amp;uf_origem=BR-5570-204482459amp;cidade_origem=amp;uf_cidade=BR%20-%20%C2%A0amp;no_estado=BRASILamp;idPagina=176) de visualização de dados que eles possuem

## Tratamento
Para o tratamento (quero otimiziar isso, mas estou focando na visualização por enquanto) é necessário baixar os dados acima em formato JSON, salvá-los na pasta `data` e acessar a página `dados.php` que vai processar e mesclar essa informação. O JSON resultante deste processo vai ser mostrado na própria página (direto no `<body>`), então basta dar `Ctrl + A` e `Ctrl + C` para copiar tudo e salvar isto num arquivo `microcefalia.json`, que vai ser chamado para gerar a visualização no `index.php`

## Visualização
Basicamente existem 3 gráficos:

* Mapa de símbolos proporcionais (círculos)
  Para cada município brasileiro, um círculo com área proporcional ao número de casos é desenhado no mapa

* Gráfico de casos em cada semana
  Mostra o saldo de casos em cada semana. Essencialmente a conta é pegar os casos acumulados de cada semana e subtrair dos casos da semana anterior (dados semanais estão disponíveis a partir da semana 7/2016)

* Gráfico de casos acumulados
  Funciona bem para comparar os municípios, qual tem mais caso, quando um superou o outro, se existem mais municípios com poucos ou muitos casos etc


## Como usar
É necessário ter os seguintes arquivos de dados na pasta `data`:

* `semanas.json`
* `UFs.json`
* `categorias.json`
* `microcefalia.json`

Depois precisa chamar o `jQuery` (futuramente quero remover esta dependência) e o `visualizacao.js`. Para criar a visualização, basta chamar a função `criar`:
```js
vis.criar();
```

## Fontes

* **Dados**: `microcefalia.json`
  * **Fonte**: [SAGE](http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php? output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=204482459&cor=005984&nonono=html&title=&codPainel=176)
  * **Importância**: É atualizado semanalmente com os dados mais recentes sobre microcefalia no Brasil
  * **Observação**: Só existem informações por município a partir da semana 6/2016. Quando soliticei estes dados (consultar pedido `25820002666201645` no [esic.gov.br](http://esic.cgu.gov.br/sistema/site/)) obtive a seguinte resposta: “Informamos que da semana epidemiológica 45/2015 até a semana epidemiológica 05/2016, os casos eram informados de forma agregada por UF; a desagregação dos casos por município e de acordo com a classificação (Notificados, em investigação, confirmados e descartados) só teve início a partir da semana epidemiológica 06/2016”

* **Dados**: `codigo-dos-municipios.json`
  * **Fonte**: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip
  * **Importância**: Traz o nome certo dos municípios
  * **Observação**: O arquivo desejado é o `RELATORIO_DTB_BRASIL_MUNICIPIO.xls`

* **Dados**: `UFs.json`
  * **Fonte**: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip
  * **Importância**: Traz o código de cada UF
  * **Observação**: O arquivo desejado é o `RELATORIO_DTB_BRASIL_MUNICIPIO.xls` (os 2 primeiros dígitos dos códigos IBGE dos municípios são o código do respectivo UF)

* **Dados**: `br-localidades-2010-v1.kml`
  * **Fonte**: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/
  * **Importância**: Traz a coordenada geográfica de cada município brasileiro
  * **Observação**: Havia apenas 5565 cidades (deveria haver 5570). Adicionei 5 cidades novas (que constavam como vilas). os códigos IBGE dessas 5 se repetiam, então precisei buscar o código certo

* **Dados**: `municipios-novos.txt`
  * **Fonte**: http://www.ibge.gov.br/home/geociencias/areaterritorial/area.shtm
  * **Importância**: Código dos 5 municípios novos
  * **Observação**: Busquei pelo nome do município e ele retornou o código

* **Dados**: `semanas-epidemiologicas.json`
  * **Fonte**: http://combateaedes.saude.gov.br/pt/situacao-epidemiologica#informes
  * **Importância**: Informa o dia de início e fim de cada semana do ano
  * **Observação**: As datas foram extraídas dos nomes dos links para os [Informes Epidemiológicos](http://combateaedes.saude.gov.br/en/epidemiological-situation#epidemiological-reports), mas acho que algumas não estavam com a quantidade de dias correta, então acho que arrumei. Nos informes constam detalhes sobre como são contadas as semanas epidemiológicas


## Autor
Este repositório é um trabalho em desenvolvimento, criado por mim, Vinicius Sueiro, como Trabalho de Conclusão de Curso (TCC) da graduação em Design pela Faculdade de Arquitetura e Urbanismo da Universidade de São Paulo (FAU USP), sob orientação de Giselle Beiguelman. Leia toda a pesquisa do projeto: [PDF no Issuu](https://issuu.com/viniciussueiro/docs/design_dos_informes_epidemiolo__gic)

## Licença
MIT © [Vinicius Sueiro](https://vsueiro.com)

<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <meta name="viewport" content="width=1024">
    <title>Microcefalia em recém-nascidos no Brasil</title>
    <meta name="author" content="Vinicius Sueiro" />
    <meta name="description" content="Visualização de dados mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central desde novembro de 2015, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css" />
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:300,400,700,800">
    <link rel="stylesheet" href="css/core.css">
    <link rel="stylesheet" href="css/vis.css">
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-53267189-1', 'auto');
      ga('send', 'pageview');
    </script>
  </head>
  <body>

    <div class="involucro">
      <article class="visualizacao">    
        <div class="grupo">
          <header>
            <h1>Microcefalia em recém-nascidos no Brasil</h1>
            <p>Visualização de dados mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central desde novembro de 2015, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos</p>
          </header>
        </div>
        <div class="grupo">
          <form class="filtros"></form>
        </div>
        <div class="grupo">
          <div class="grafico mapa"></div> 
          <section class="totais"></section>
        </div>
        <div class="grupo">
          <section class="classificacao municipios"></section>
        </div>
        <nav class="navegacao"></nav>
        <div class="grupo">
          <footer>
            <article>
              <p>[Trabalho em desenvolvimento]</p>
              <p>Esta visualização de dados é de código aberto e está disponível neste <a href="https://github.com/vsueiro/microcefalia">repositório do GitHub</a>.</p>
              <p>Este material é criado por mim, Vinicius Sueiro, como Trabalho de Conclusão de Curso (TCC) da graduação em Design pela Faculdade de Arquitetura e Urbanismo da Universidade de São Paulo (FAU USP), sob orientação de Giselle Beiguelman. Leia toda a pesquisa do projeto: <a href="https://issuu.com/viniciussueiro/docs/design_dos_informes_epidemiolo__gic">PDF no Issuu</a></p>
              <p>A base de dados utilizada é oficial e está disponível no site da <a href="http://sage.saude.gov.br/">Sala de Apoio à Gestão Estratégica do Ministério da Saúde</a>, mais especificamente através do botão <code>Lista microcefalia</code> no <a href="http://sage.saude.gov.br/?link=microcefalia&amp;flt=true&amp;param=amp;uf_origem=BR-5570-204482459amp;cidade_origem=amp;uf_cidade=BR%20-%20%C2%A0amp;no_estado=BRASILamp;idPagina=176">painel</a> de visualização de dados que eles possuem</p>
              <ul>
                <li>
                  <p><strong>Dados</strong>: <code>microcefalia.json</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?%20output=json&amp;ufs=&amp;ibges=&amp;cg=&amp;tc=&amp;re_giao=&amp;rm=&amp;qs=&amp;ufcidade=Brasil&amp;qt=5570%20munic%C3%ADpios&amp;pop=204482459&amp;cor=005984&amp;nonono=html&amp;title=&amp;codPainel=176">SAGE</a></li>
                    <li><strong>Importância</strong>: É atualizado semanalmente com os dados mais recentes sobre microcefalia no Brasil</li>
                    <li><strong>Observação</strong>: Só existem informações por município a partir da semana 6/2016. Quando soliticei estes dados (consultar pedido <code>25820002666201645</code> no <a href="http://esic.cgu.gov.br/sistema/site/">esic.gov.br</a>) obtive a seguinte resposta: “Informamos que da semana epidemiológica 45/2015 até a semana epidemiológica 05/2016, os casos eram informados de forma agregada por UF; a desagregação dos casos por município e de acordo com a classificação (Notificados, em investigação, confirmados e descartados) só teve início a partir da semana epidemiológica 06/2016”</li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>codigo-dos-municipios.json</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip">ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip</a></li>
                    <li><strong>Importância</strong>: Traz o nome certo dos municípios</li>
                    <li><strong>Observação</strong>: O arquivo desejado é o <code>RELATORIO_DTB_BRASIL_MUNICIPIO.xls</code>
                    </li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>UFs.json</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip">ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip</a></li>
                    <li><strong>Importância</strong>: Traz o código de cada UF</li>
                    <li><strong>Observação</strong>: O arquivo desejado é o <code>RELATORIO_DTB_BRASIL_MUNICIPIO.xls</code> (os 2 primeiros dígitos dos códigos IBGE dos municípios são o código do respectivo UF)</li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>br-localidades-2010-v1.kml</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/">ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/</a></li>
                    <li><strong>Importância</strong>: Traz a coordenada geográfica de cada município brasileiro</li>
                    <li><strong>Observação</strong>: Havia apenas 5565 cidades (deveria haver 5570). Adicionei 5 cidades novas (que constavam como vilas). os códigos IBGE dessas 5 se repetiam, então precisei buscar o código certo</li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>municipios-novos.txt</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="http://www.ibge.gov.br/home/geociencias/areaterritorial/area.shtm">http://www.ibge.gov.br/home/geociencias/areaterritorial/area.shtm</a></li>
                    <li><strong>Importância</strong>: Código dos 5 municípios novos</li>
                    <li><strong>Observação</strong>: Busquei pelo nome do município e ele retornou o código</li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>semanas-epidemiologicas.json</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="http://combateaedes.saude.gov.br/pt/situacao-epidemiologica#informes">http://combateaedes.saude.gov.br/pt/situacao-epidemiologica#informes</a></li>
                    <li><strong>Importância</strong>: Informa o dia de início e fim de cada semana do ano</li>
                    <li><strong>Observação</strong>: As datas foram extraídas dos nomes dos links para os <a href="http://combateaedes.saude.gov.br/en/epidemiological-situation#epidemiological-reports">Informes Epidemiológicos</a>, mas acho que algumas não estavam com a quantidade de dias correta, então acho que arrumei. Nos informes constam detalhes sobre como são contadas as semanas epidemiológicas</li>
                  </ul>
                </li>
                <li>
                  <p><strong>Dados</strong>: <code>ibge-populacao-estimada-2016-07-01.csv</code></p>
                  <ul>
                    <li><strong>Fonte</strong>: <a href="http://www.ibge.gov.br/home/estatistica/populacao/estimativa2016/estimativa_dou.shtm">http://www.ibge.gov.br/home/estatistica/populacao/estimativa2016/estimativa_dou.shtm</a></li>
                    <li><strong>Importância</strong>: Números estimados de população (com código IBGE de 7 dígitos)</li>
                    <li><strong>Observação</strong>: Estimativas da população residente no Brasil e Unidades da Federação com data de referência de 1º de julho de 2016. Fonte: IBGE. Diretoria de Pesquisas - DPE - Coordenação de População e Indicadores Socias - COPIS</li>
                  </ul>
                </li>
              </ul>
            </article>
          </footer>
        </div>
        <!-- <section class="grafico acumulado municipios"></section> -->
        <!-- <section class="grafico acumulado UFs"></section> -->
      </article>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="libs/dragdealer.js"></script>
    <script src="js/core.js"></script>
    <script src="js/vis.js"></script>
  </body>
</html>
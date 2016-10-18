<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tratamento de dados – TCC</title>
  </head>
  <body>
    
    <p>Carregando dados...</p>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

    <script src="js/dados.js"></script>

    <!--

    implementar:

        busca e filtros
            por município
            por semana
            por categoria
            natural language form?

        dicionário
            SE -> semana normal (ex: SE 20 equivale do dia X a Y do mês Z, do ano A)
    
        comparação
            município A x município B no mesmo período

        gráficos
            evolução de cada município quando selecionado

        ranking
            municípios com maior quantidade dos casos selecionados
            municípios com menor quantidade dos casos selecionados

        processamento de dados no servidor (não via JS)
            com python, php, node, etc

        mapa
            com evolução dos casos

        incorporação
            iframe com parâmetros?
            JS?

        git
            disponibilizar repositório

        download
            vetorial (svg)
            pdf (impressão)

        impressão
            css print
    
        legendas
            casos de microcefalia ou zika? RE: microcefalia e/ou alteração do SNC de causa congênita
            tamanho do círculo
            cores
            categorias

        autoplay
            default
            opção de pausar
            opção de retomar

        slider (barra horizontal para selecionar as semanas)
            seleção individual (SE X)
            seleção grupo (SE X a Y)

        flexibilidade
            permitir múltiplos anos
            permitir incorporar dados de outros países?
            permitir incorporar novos atributos aos dados?

        explicações animadas / passo a passo

        versão desktop

        versão celular

        versão AR?

        versão 3D?

    -->

    <!--
    
    data: lista-microcefalia-2016-09-08.json
    src: http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=204482459&cor=005984&nonono=html&title=&codPainel=176
    obs1: Atualizado até 08/09/2016 às 00:00
    obs2: Só existem informações por município a partir da semana 06/2016. Quando soliticei estes dados (consultar pedido 25820002666201645 no esic.gov.br) obtive a seguinte resposta: “Informamos que da semana epidemiológica 45/2015 até a semana epidemiológica 05/2016, os casos eram informados de forma agregada por UF; a desagregação dos casos por município e de acordo com a classificação (Notificados, em investigação, confirmados e descartados) só teve início a partir da semana epidemiológica 06/2016”
  
    data: codigo-dos-municipios.json
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip (arquivo: RELATORIO_DTB_BRASIL_MUNICIPIO.xls)
    obs1: nome certo dos municípios

    data: codigo-das-UF.js
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip (arquivo: RELATORIO_DTB_BRASIL_MUNICIPIO.xls)
    obs1: lista com código de UF (2 primeiros dígitos dos códigos de município)

    data: br-localidades-2010-v1.kml
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/
    obs1: haviam apenas 5565 cidades, adicionei 5 cidades novas (constavam como vilas). os códigos IBGE dessas 5 se REPETEM, preciso achar o código certo

    data: códigos dos 5 municípios novos
    src:  http://www.ibge.gov.br/home/geociencias/areaterritorial/area.shtm
    obs1: busquei pelo nome do município e ele retornou o código

    data: semanas-epidemiologicas.json
    src:  http://combateaedes.saude.gov.br/pt/situacao-epidemiologica#informes
    obs1: as datas foram extraídas dos nomes dos links para os Informes Epidemiológicos. Nos informes constam detalhes sobre como são contadas as semanas epidemiológicas

    -->

  </body>
</html>

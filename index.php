<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tratamento de dados – TCC</title>
  </head>
  <body>
    
    <p>Carregando dados...</p>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

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

        processamento de dados no servidor (não via JS)

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
            casos de microcefalia ou zika? RE: microcefalia e/ou alteração do SNC
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
  
    data: lista-microcefalia-2016-08-21.json
    src:  http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=204482459&cor=005984&nonono=html&title=&codPainel=176
    obs:  Atualizado até 17/08/2016 às 00:00
  
    data: codigo-dos-municipios.json
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip
    obs:  nome certo dos municípios

    data: codigo-dos-municipios-talvez-mais-completo.json
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip (arquivo: RELATORIO_DTB_BRASIL_MUNICIPIO.xls)
    obs:  checar se bate com o outro json (2 fontes diferentes)

    data: codigo-das-UF.js
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip
    obs:  lista com código de UF (2 primeiros dígitos dos códigos de município)

    data: br-localidades-2010-v1.kml
    src:  ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/
    obs:  haviam apenas 5565 cidades, adicionei 5 cidades novas (constavam como vilas). os códigos IBGE dessas 5 se REPETEM, preciso achar o código certo

    data: códigos os 5 municípios novos
    src:  http://www.ibge.gov.br/home/geociencias/areaterritorial/area.shtm
    obs:  busquei pelo nome do município e ele retornou o código

    -->

  </body>
</html>

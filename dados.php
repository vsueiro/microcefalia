<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tratamento de dados – TCC</title>
  </head>
  <body>
    <p>Carregando dados...</p>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script>
        var caminho = window.location.protocol + '//' + window.location.host + window.location.pathname;
        var quantidade = 0;

        caminho = caminho.substring( 0, caminho.lastIndexOf( '/' ) + 1 );

        function cleanCSV( data )
        {
          var csv = 'id,nome,latitude,longitude,ano,sem,ta<br>';
          $.each( data, function( i, m )
          {
            var casoMaisRecente = m.casos[ m.casos.length - 1 ];
            var ano = casoMaisRecente.ano;
            var sem = casoMaisRecente.sem;
            var tn = casoMaisRecente.tn;
            // precisa adicionar todas as categorias em todas as semanas
            if ( tn > 0 )
            {
              csv += m[ 'id' ] + ',' + m.nome + ',' + m.coordenadas.lat + ',' + m.coordenadas.lon + ',' + ano + ',' + sem + ',' + tn + '<br>';
              quantidade++;
            }
          } );
          console.log( 'csv retornou ' + quantidade + ' municípios' );
          return csv;
        }

        function clean( json, format )
        {
          console.log( 'Carregando JSON de coordenadas...' );
          var municipiosCoordenadas;
          $.getJSON( caminho + 'data/br-localidades-2010.json', function( dados )
          {
            municipiosCoordenadas = dados;
          } );
          console.log( 'Carregandon JSON com casos de microcefalia e zika...' );
          var municipiosUnicos = [];
          var municipios = [];
          var reali = 0;
          $.getJSON( json, function( resultado )
          {
            $.each( resultado.resultset, function( i, dados )
            {
              var id = parseInt( dados[ 0 ] );
              if ( $.inArray( id, municipiosUnicos ) > -1 )
              { // se já consta o ID do município no array de únicos
                var caso = {
                  "ano": parseInt( dados[ 4 ] ),
                  "sem": parseInt( dados[ 3 ] ),
                  "n": parseInt( dados[ 5 ] ),
                  "i": parseInt( dados[ 6 ] ),
                  "c": parseInt( dados[ 7 ] ),
                  "d": parseInt( dados[ 8 ] ),
                  "on": parseInt( dados[ 9 ] ),
                  "oi": parseInt( dados[ 10 ] ),
                  "oc": parseInt( dados[ 11 ] ),
                  "od": parseInt( dados[ 12 ] )
                }
                municipios[ reali - 1 ][ 'casos' ].push( caso );
              }
              else
              { // se não consta
                municipiosUnicos.push( id );
                municipios[ reali ] = {
                  "id": id,
                  "nome": dados[ 2 ],
                  "casos": []
                };
                var caso = {
                  "ano": parseInt( dados[ 4 ] ),
                  "sem": parseInt( dados[ 3 ] ),
                  "n": parseInt( dados[ 5 ] ),
                  "i": parseInt( dados[ 6 ] ),
                  "c": parseInt( dados[ 7 ] ),
                  "d": parseInt( dados[ 8 ] ),
                  "on": parseInt( dados[ 9 ] ),
                  "oi": parseInt( dados[ 10 ] ),
                  "oc": parseInt( dados[ 11 ] ),
                  "od": parseInt( dados[ 12 ] )
                }
                municipios[ reali ][ 'casos' ].push( caso );
                lasti = i;
                reali++;
              }
            } );
            console.log( 'Mesclando as duas bases de dados...' );
            $.each( municipios, function( i, municipio )
            {
              var found = false;
              $.each( municipiosCoordenadas, function( j, municipiosCoordenada )
              {
                var trimId = '';
                trimId += municipiosCoordenada[ 'id-ibge' ];
                trimId = trimId.slice( 0, -1 ); // remove último dígito
                if ( municipio[ 'id' ] == trimId )
                {
                  municipio[ 'id' ] = municipiosCoordenada[ 'id-ibge' ];
                  municipio[ 'geo' ] = {
                    "lat": parseFloat( municipiosCoordenada[ 'latitude' ] ),
                    "lng": parseFloat( municipiosCoordenada[ 'longitude' ] )
                  };
                  found = true;
                }
              } );
              if ( !found )
              {
                console.log( 'não encontrado: ' + municipio[ 'id' ] );
              }
            } );
            /*  

            if ( format == 'json' ) {
              
              $( 'body' ).html( JSON.stringify( municipios ) ); // JSON completo para download (com dados zerados e quantidades acumuladas)

            }

            if ( format == 'csv'  ) {

              $( 'body' ).html( cleanCSV( municipios ) );

            }

            */
            // remover casos e municípios zerados
            {
              var i = municipios.length;
              while ( i-- )
              {
                var j = municipios[ i ].casos.length;
                var empty = true;
                while ( j-- )
                {
                  var caso = municipios[ i ].casos[ j ];
                  if ( caso.n == 0 ) delete caso.n;
                  if ( caso.i == 0 ) delete caso.i;
                  if ( caso.c == 0 ) delete caso.c;
                  if ( caso.d == 0 ) delete caso.d;
                  if ( caso.on == 0 ) delete caso.on;
                  if ( caso.oi == 0 ) delete caso.oi;
                  if ( caso.oc == 0 ) delete caso.oc;
                  if ( caso.od == 0 ) delete caso.od;
                  { // deixar apenas casos e óbitos confirmados e investigados
                    if ( caso.n ) delete caso.n;
                    // if ( caso.i ) delete caso.i;
                    // if ( caso.d ) delete caso.d;
                    if ( caso.on ) delete caso.on;
                    // if ( caso.oi ) delete caso.oi;
                    // if ( caso.od ) delete caso.od;
                  }
                  if ( Object.keys( caso )
                    .length > 2 )
                  {
                    empty = false;
                  }
                  else
                  {
                    municipios[ i ].casos.splice( j, 1 );
                  }
                }
                if ( empty )
                {
                  console.log( 'municípios foram removidos' );
                  municipios.splice( i, 1 );
                }
              }
            }
            // adicionar dado de população
            console.log( 'total de municipios com casos e obitos confirmados' + municipios.length );
            $.getJSON( caminho + 'data/ibge-populacao-estimada-2016-07-01.json', function( populacao )
            {
              for ( var i = 0, leni = municipios.length; i < leni; i++ )
              {
                var municipio = municipios[ i ];
                // console.log( populacao[ municipio.id ] );
                if ( populacao[ municipio.id ] )
                {
                  console.log( 'adicionou dado de populacao' );
                  municipio[ 'pop' ] = populacao[ municipio.id ];
                }
                else
                {
                  // console.error( municipio );
                }
              }
              console.log( municipios );
              if ( format == 'json' )
              {
                $( 'body' )
                  .html( JSON.stringify( municipios ) ); // JSON para a visualização (com dados zerados e quantidades acumuladas)
              }
            } );
          } );
        }
        clean( caminho + 'data/listaMicrocefalia.json', 'json' );
    </script>
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

    data: ibge-populacao-estimada-2016-07-01.csv
    src: http://www.ibge.gov.br/home/estatistica/populacao/estimativa2016/estimativa_dou.shtm
    obs1: estimativas da população residente no Brasil e Unidades da Federação com data de referência de 1º de julho de 2016. Fonte: IBGE. Diretoria de Pesquisas - DPE - Coordenação de População e Indicadores Socias - COPIS.

    -->
  </body>
</html>

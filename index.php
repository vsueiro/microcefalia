<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <title>Mapa da microcefalia no Brasil</title>

  </head>
  <body>

    <article class="visualizacao">

      <h1>Microcefalia em recém nascidos no Brasil</h1>

      <p>O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também pelo tipo de caso (confirmado, investigado, descartado etc)</p>

      <section class="totais">
        
        <p></p>

        <ul>
          <li data-caso="tc"></li>
          <li data-caso="toc"></li>
        </ul>

      </section>

      <form>

        <select class="semanas">
          <option disabled>Escolha a semana epidemiológica</option>
        </select>

        <select class="categorias">
          <option disabled>Escolha o tipo de caso</option>
        </select>

        <input type="search" name="municipio" placeholder="Buscar por município">

      </form>
      
      <br>

      <div id="mapa"></div>

      <ul class="ficha"></ul>

      <br>

      <nav>

        <button>Baixar dados</button>
        <button>Baixar svg (vetor)</button>
        <button>Baixar pdf (impressão)</button>
        <button>Incorporar ao meu site</button>
        <button>Tela cheia</button>

      </nav>

      <br>

      <footer>

        <dl>
          
          <dt>Observações</dt>
          <dd>
            No período entre a semana epidemiológica 45/2015 e a 05/2016 (8 de novembro de 2015 a 6 de fevereiro de 2016, respectivamente) os casos eram informados de forma agregada por UF; a desagregação por município e de acordo com a classificação (notificados, em investigação, confirmados e descartados) só teve início a partir da semana epidemiológica 06/2016 (7 de fevereiro de 2016)
          </dd>
          <dd>
            Total Acumulado = Total Notificado = Total Investigado + Total Confirmado + Total Descartado
          </dd>
          <dd>
            Total Óbito Notificado = Total Óbito Investigado + Total Óbito Confirmado + Total Óbito Descartado
          </dd>

          <dt>Método</dt>
          <dd>
            -
          </dd>

          <dt>Fontes</dt>
          <dd>-</dd>

          <dt>Colabore</dt>
          <dd>
            Esta visualização de dados é de código aberto. Caso queira colaborar ou criar sua própria, utilize este <a href="#">repositório Git</a>
          </dd>

        </dl>

      </footer>

      <svg
        version="1.1"
        id="Line chart"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="800px"
        height="600px"
        viewBox="0 0 800 600"
        enable-background="new 0 0 800 600"
        xml:space="preserve">

        <g id="lines"></g>

      </svg>


    </article>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

    <script>

      var municipios = [

        {
          "nome" : "Salvador",
          "casos" :[
            {
              "sem" : 6,
              "tc" : 60
            },
            {
              "sem" : 7,
              "tc" : 63
            },
            {
              "sem" : 8,
              "tc" : 65
            },
            {
              "sem" : 9,
              "tc" : 75
            },
            {
              "sem" : 10,
              "tc" : 90
            },
            {
              "sem" : 11,
              "tc" : 79
            },
            {
              "sem" : 12,
              "tc" : 85
            },
            {
              "sem" : 13,
              "tc" : 93
            },
            {
              "sem" : 14,
              "tc" : 100
            },
            {
              "sem" : 15,
              "tc" : 109
            },
            {
              "sem" : 16,
              "tc" : 110
            },
            {
              "sem" : 17,
              "tc" : 119
            },
            {
              "sem" : 18,
              "tc" : 121
            },
            {
              "sem" : 19,
              "tc" : 125
            },
            {
              "sem" : 20,
              "tc" : 126
            },
            {
              "sem" : 21,
              "tc" : 127
            },
            {
              "sem" : 22,
              "tc" : 128
            },
            {
              "sem" : 23,
              "tc" : 129
            },
            {
              "sem" : 24,
              "tc" : 137
            },
            {
              "sem" : 25,
              "tc" : 137
            },
            {
              "sem" : 26,
              "tc" : 137
            },
            {
              "sem" : 27,
              "tc" : 137
            },
            {
              "sem" : 28,
              "tc" : 145
            },
            {
              "sem" : 29,
              "tc" : 145
            },
            {
              "sem" : 30,
              "tc" : 145
            },
            {
              "sem" : 31,
              "tc" : 145
            },
            {
              "sem" : 32,
              "tc" : 145
            },
            {
              "sem" : 33,
              "tc" : 145
            },
            {
              "sem" : 34,
              "tc" : 145
            },
            {
              "sem" : 35,
              "tc" : 147
            },
            {
              "sem" : 36,
              "tc" : 147
            },
            {
              "sem" : 37,
              "tc" : 153
            }
          ]
        }
        
      ];
      
      var lines = document.getElementById( 'lines' );

      for ( var i = 0; i < municipios.length; i++ ) {

        var municipio = municipios[ i ];

        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          group.setAttribute( 'id', municipio.nome );

        for ( var j = 0; j < ( municipio.casos.length - 1 ); j++ ) {

          var caso = municipio.casos[ j ];

          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              line.setAttribute( 'fill', 'none' );
              line.setAttribute( 'stroke', '#FF0000' );
              line.setAttribute( 'stroke-width', '4' );
              line.setAttribute( 'stroke-linecap', 'round' );
              line.setAttribute( 'stroke-linejoin', 'round' );
              line.setAttribute( 'opacity', '1' );
              line.setAttribute( 'x1' , ( caso.sem * 10 ) );
              line.setAttribute( 'x2' , ( municipio.casos[ j + 1 ].sem * 10 ) );
              line.setAttribute( 'y1' , ( caso.tc ) );
              line.setAttribute( 'y2' , ( municipio.casos[ j + 1 ] ? municipio.casos[ j + 1 ].tc : caso.tc ) );
              
            group.appendChild( line );

        }

        lines.appendChild( group );

      }
    </script>

  </body>
</html>
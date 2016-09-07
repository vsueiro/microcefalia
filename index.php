<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">

    <title>Mapa de microcefalia no Brasil</title>

    <style>

      html,
      body {
        height: 100%;
        font-family: 'Open Sans', sans-serif;
      }
      #mapa {
        width: 970px;
        height: 970px;
      }
      .ficha {
        border: 2px solid #eee;
      }

    </style>

  </head>
  <body>

    <h1>Microcefalia em recém nascidos no Brasil</h1>

    <p>O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também pelo tipo de caso (confirmado, investigado, descartado etc)</p>

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

        <dt>Método</dt>
        <dd>
          Praesent vitae massa vestibulum, fermentum purus ac, lacinia urna. Nam justo turpis, ultricies quis libero vel, laoreet porttitor elit. Sed hendrerit neque vel erat tincidunt tempor. Integer auctor auctor ligula. Donec sagittis lacinia tincidunt. Maecenas laoreet, risus quis blandit convallis, enim ante viverra mauris, sit amet volutpat nunc mi nec tortor. Donec nec elementum mi, id sodales urna. Aliquam laoreet sem in vestibulum mattis. Fusce auctor efficitur venenatis. Cras tortor lacus, eleifend vel est in, malesuada fringilla sapien. Quisque in diam nec leo mattis molestie ut ut lorem. In sit amet iaculis
        </dd>

        <dt>Fontes</dt>
        <dd><a href="#">FonteA</a>, <a href="#">FonteB</a>, <a href="#">FonteC</a></dd>

        <dt>Colabore</dt>
        <dd>
          Esta visualização de dados é de código aberto. Caso queira colaborar ou criar sua própria, utilize este <a href="#">repositório Git</a>
        </dd>

      </dl>

    </footer>

    <script>

      var
        municipios,
        municipio,
        circulos = [],
        circulo,
        semanas = [],
        semana,
        caso,
        mapa,
        ficha,
        categorias,
        categoria
      ;

      function initMap() {
        mapa = new google.maps.Map(document.getElementById('mapa'), {
          zoom: 5,
          minZoom: 2,
          center: new google.maps.LatLng(-15.474053, -53.290964),    
          styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"gamma":"0.00"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"32"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"63"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#eeeeee"}]}], // https://snazzymaps.com/style/42346/for-beautiful-maps-to-hang-on-your-wall
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          scrollWheel: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        });

      }

    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs&callback=initMap"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script>

      ficha = $( '.ficha' );

      categorias = [ 
        {
          "apelido" : "ta",
          "nome" : "Total acumulado",
          "atual" : true
        },
        {
          "apelido" : "ti",
          "nome" : "Total investigado",
          "atual" : false
        },
        {
          "apelido" : "tc",
          "nome" : "Total confirmado",
          "atual" : false
        },
        {
          "apelido" : "td",
          "nome" : "Total descartado",
          "atual" : false
        },
        {
          "apelido" : "ton",
          "nome" : "Total de óbitos notificados",
          "atual" : false
        },
        {
          "apelido" : "toi",
          "nome" : "Total de óbitos investigados",
          "atual" : false
        },
        {
          "apelido" : "toc",
          "nome" : "Total de óbitos confirmados",
          "atual" : false
        },
        {
          "apelido" : "tod",
          "nome" : "Total de óbitos descartados",
          "atual" : false
        }
      ];



      Array.prototype.removeDuplicados = function() {

        var
          u = {},
          a = []
        ;

        for ( var i = 0, l = this.length; i < l; ++i ) {

          if ( u.hasOwnProperty( this[ i ] ) ) {
             continue;
          }

          a.push( this[ i ] );
          u[ this[ i ] ] = 1; 

        }

        return a;

      }

      function desenharBolhas( sem, cat ) {

        for ( var i = 0, leni = circulos.length; i < leni; i++ ) {

          circulo = circulos[ i ];
          municipio = municipios[ i ];

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

            caso = municipio.casos[ j ];

            if ( caso.sem == sem ) {

              circulo.setIcon({

                path: google.maps.SymbolPath.CIRCLE,
                scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * 5, 
                fillColor: '#f4874c',
                fillOpacity: 0.5,
                strokeColor: '#f4874c',
                strokeWeight: 0

              });

              break;

            }
            
          }

        }
      
      }

      function UF( n, output ) {

        var id = n.toString().substring(0, 2);

        for ( var i = 0, leni = UFs.length; i < leni; i++ ) {

          if ( UFs[ i ][ 'id' ] == id ) {

            return UFs[ i ][ output ];

          }

        }

      }

      function semanaAtual() {
        semana = parseInt( $( '.semanas' ).val() );
        return semana;
      }

      function categoriaAtual() {
        categoria = $( '.categorias' ).val();
        return categoria;
      }

      function mostraFicha( i, sem, cat ) {

        municipio = municipios[ i ];

        ficha.empty();

        ficha.append( '<li>Município: ' + municipio.nome + '</li>' );
        ficha.append( '<li>UF: ' + UF( municipio[ 'id' ], 'nome' ) + '</li>' );
        ficha.append( '<li>Semana: ' + sem + '</li>' );

        for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

          caso = municipio.casos[ j ];

          if ( caso.sem == sem ) {

            for ( var k = 0, lenk = categorias.length; k < lenk; k++ ) {

              categoria = categorias[ k ];
              var quantidade = caso[ categoria.apelido ] || 0;

              ficha.append( '<li>' + categoria.nome + ': ' + quantidade + '</li>' );  

            }            
            
            break;

          }
          
        }

      }

      $( document ).ready( function() {

        $.getJSON( 'data/codigo-das-UF.json', function( dados ) {

          UFs = dados;

        });

        $.getJSON( 'data/lista-microcefalia-2016-08-21-clean-sem-itens-zerados.json', function( dados ) {

          municipios = dados;

          for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

            municipio = municipios[ i ];

            circulo = new google.maps.Marker({

              indice: i,
              id: municipio[ 'id' ],
              map: mapa,
              title: municipio.nome,
              position: municipio.geo,
              icon: {

                path: google.maps.SymbolPath.CIRCLE,
                scale: 0, 
                fillColor: '#f4874c',
                fillOpacity: 0.5,
                strokeColor: '#f4874c',
                strokeWeight: 0

              }

            });

            circulo.addListener( 'click', function() {

              mostraFicha( this.indice, semanaAtual(), categoriaAtual() );
              
            });

            circulos.push( circulo );

            for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

              caso = municipio.casos[ j ];

              semanas.push( caso.sem );
              
            }

          }

          semanas = semanas.removeDuplicados();

          for ( var i = 0, leni = semanas.length; i < leni; i++ ) {

            semana = semanas[ i ];

            var atual = i == leni - 1 ? ' selected' : '';

            $( 'select.semanas' ).append( '<option value="' + semana + '"'+ atual +'>' + semana + '</option>' );

          }

          for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

            categoria = categorias[ i ];

            var atual = categoria.atual ? ' selected' : '';

            $( 'select.categorias' ).append( '<option value="' + categoria.apelido + '"'+ atual +'>' + categoria.nome + '</option>' );

          }

          desenharBolhas( semanaAtual(), categoriaAtual() );

        });

        $( document ).on( 'change', '.semanas, .categorias', function() {

          desenharBolhas( semanaAtual(), categoriaAtual() );

        });

      });

    </script>

  </body>
</html>
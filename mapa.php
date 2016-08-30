<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">

    <title>Mapa de microcefalia no Brasil</title>

    <style>

      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      #mapa {
        width: 970px;
        height: 970px;
      }

    </style>

  </head>
  <body>

    <select class="semanas">
      <option disabled>Escolha a semana epidemiológica</option>
    </select>

    <select class="categorias">
      <option disabled>Escolha o tipo de caso</option>
    </select>

    <div id="mapa"></div>

    <script>

      var
        municipios,
        mapa,
        circulo,
        ponto,
        circulos = [],
        pontos = [],
        semanas = [],
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

        ]
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

      Array.prototype.removeDuplicados = function() {
        var u = {}, a = [];
        for(var i = 0, l = this.length; i < l; ++i){
          if(u.hasOwnProperty(this[i])) {
             continue;
          }
          a.push(this[i]);
          u[this[i]] = 1;
        }
        return a;
      }

      function removeCirculos() {
          for(i=0; i<circulos.length; i++){
              circulos[i].setMap(null);
          }
      }

      function desenharBolhas( municipios, semana, categoria ) {

        removeCirculos();
        circulos = [];
        pontos = [];

        $.each( municipios, function( i, municipio ) {

          $.each( municipio.casos, function( j, caso ) {

            if ( caso.sem == semana ) { // default

              circulo = new google.maps.Marker({

                title: municipio.nome,
                position: municipio.geo,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: Math.sqrt( caso[ categoria ] ) / Math.PI * 5, // a ultima multiplicação é só para ampliar, 
                  fillColor: '#f4874c',
                  fillOpacity: 0.33,
                  strokeColor: '#f4874c',
                  strokeWeight: 1
                },
                map: mapa

              });

              ponto = new google.maps.Marker({

                title: municipio.nome,
                position: municipio.geo,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 1,
                  fillColor: '#000',
                  fillOpacity: 0.75,
                  strokeColor: '#f4874c',
                  strokeWeight: 0
                },
                map: mapa

              });

              circulos.push( circulo );
              pontos.push( ponto );

            }

          });

        });
      
      }

      $( document ).ready( function() {

        $.getJSON( 'data/lista-microcefalia-2016-08-21-clean-sem-itens-zerados.json' , function( dados ) {

          municipios = dados;

          $.each( municipios, function( i, municipio ) {

            circulo = new google.maps.Marker({

              title: municipio.nome,
              position: municipio.geo,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1, 
                fillColor: '#f4874c',
                fillOpacity: 0.33,
                strokeColor: '#f4874c',
                strokeWeight: 1
              },
              map: mapa

            });

            ponto = new google.maps.Marker({

              title: municipio.nome,
              position: municipio.geo,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1,
                fillColor: '#000',
                fillOpacity: 0.75,
                strokeColor: '#f4874c',
                strokeWeight: 0
              },
              map: mapa

            });

            circulos.push( circulo );
            pontos.push( ponto );

            $.each( municipio.casos, function( j, caso ) {

              semanas.push( caso.sem );

            });

          });

          semanas = semanas.removeDuplicados();

          $.each( semanas, function( i, semana ) {

            var atual = i == semanas.length - 1 ? ' selected' : '';
            $( 'select.semanas' ).append( '<option value="' + semana + '"'+ atual +'>' + semana + '</option>' );

          });

          $.each( categorias, function( i, categoria ) {

            var atual = categoria.atual ? ' selected' : '';
            $( 'select.categorias' ).append( '<option value="' + categoria.apelido + '"'+ atual +'>' + categoria.nome + '</option>' );

          });

          var
            sem = parseInt( $( '.semanas' ).val() ),
            cat = $( '.categorias' ).val()
          ;

          desenharBolhas( municipios, sem, cat );

        });

        $( document ).on( 'change', '.semanas, .categorias', function() {

            var
              sem = parseInt( $( '.semanas' ).val() ),
              cat = $( '.categorias' ).val()
            ;

            desenharBolhas( municipios, sem, cat );

        });

      });

    </script>

  </body>
</html>
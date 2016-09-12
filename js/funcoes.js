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

function atualizaCirculos( sem, cat ) {

  for ( var i = 0, leni = circulos.length; i < leni; i++ ) {

    circulo = circulos[ i ];
    municipio = municipios[ i ];

    for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

      caso = municipio.casos[ j ];

      if ( caso.sem == sem ) {

        circulo.setIcon({

          path: google.maps.SymbolPath.CIRCLE,
          scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * 5, 
          fillColor: cor.circulo.normal,
          fillOpacity: 0.5,
          strokeColor: cor.circulo.normal,
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

function desenhaCirculos() {

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
          fillColor: cor.circulo.normal,
          fillOpacity: 0.5,
          strokeColor: cor.circulo.normal,
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

    atualizaCirculos( semanaAtual(), categoriaAtual() );

  });

}

function criaMapa() {

  mapa = new google.maps.Map(document.getElementById('mapa'), {
    zoom: 5,
    minZoom: 5,
    center: new google.maps.LatLng(-15.474053, -53.290964),    
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"gamma":"0.00"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"32"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"63"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#eeeeee"}]}],
    // https://snazzymaps.com/style/42346/for-beautiful-maps-to-hang-on-your-wall
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollWheel: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  desenhaCirculos();

}

function carregaMapa() {

  var script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs&callback=criaMapa';
  document.body.appendChild( script );

}
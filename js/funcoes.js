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

  for ( var i = 0, leni = circulos.length; i < leni; i++ ) { // para cada círculo no mapa

    circulo = circulos[ i ];
    municipio = municipios[ i ];
    consta = false;

    for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) { // para cada caso do respectivo município

      caso = municipio.casos[ j ];

      if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

        if ( circulo == selecionado ) {

          circulo.setIcon({

            path: google.maps.SymbolPath.CIRCLE,
            scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * amplitude, 
            fillColor: cor.circulo.normal,
            fillOpacity: 0.75,
            strokeColor: cor.circulo.selecionado,
            strokeWeight: 1

          });

        } else {

          circulo.setIcon({

            path: google.maps.SymbolPath.CIRCLE,
            scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * amplitude, 
            fillColor: cor.circulo.normal,
            fillOpacity: 0.33,
            strokeColor: cor.circulo.normal,
            strokeWeight: 0

          });

        }

        consta = true;

        break;

      }

    }

    if ( !consta ) { // se não há informação, zera o círculo

      circulo.setIcon({

        path: google.maps.SymbolPath.CIRCLE,
        scale: 0, 
        fillColor: cor.circulo.normal,
        fillOpacity: 0.33,
        strokeColor: cor.circulo.normal,
        strokeWeight: 0

      });

    }

  }

}

function UF( n, retorno ) {

  var id = n.toString().substring(0, 2);

  for ( var i = 0, leni = UFs.length; i < leni; i++ ) {

    if ( UFs[ i ][ 'id' ] == id ) {

      return UFs[ i ][ retorno ];

    }

  }

}

function semanaAtual() {

  semana = $( '.semanas' ).val();
  semana = semana.split( '/' );
  semana = {
    "numero" : parseInt( semana[ 0 ] ),
    "ano" : parseInt( semana[ 1 ] )
  };
  return semana;

}

function categoriaAtual() {

  categoria = $( '.categorias' ).val();
  return categoria;

}

function dataDaSemana( sem, ano, data ) {

  for ( var i = 0, leni = dataDasSemanas.length; i < leni; i++ ) {

    if ( sem == dataDasSemanas[ i ][ 'numero' ] && ano == dataDasSemanas[ i ][ 'ano' ] ) {

      var partes = dataDasSemanas[ i ][ data ].split( '-' ); // YYYY-MM-DD

      return parseInt( partes[ 2 ] ) + ' de ' + meses[ parseInt( partes[ 1 ] ) - 1 ] + ' de ' + partes[ 0 ]; // DD de mmmm de YYYY

    }

  }
        
}

function mostraFicha( i, sem, cat ) {

  visualizacao
    .attr( 'data-ficha', 'true' )
    .attr( 'data-municipio', i );

  municipio = municipios[ i ];

  ficha.empty();
  ficha.append( '<li>Município: ' + municipio.nome + '</li>' );
  ficha.append( '<li>UF: ' + UF( municipio[ 'id' ], 'nome' ) + '</li>' );
  ficha.append( '<li>Semana: ' + sem.numero + '</li>' );

  var grafico = '';

  for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) { // para cada semana epidemiológica do município

    caso = municipio.casos[ i ];

    if ( caso.sem == sem.numero ) {

      for ( var j = 0, lenj = categorias.length; j < lenj; j++ ) {

        categoria = categorias[ j ];
        var quantidade = caso[ categoria.apelido ] || 0;
        var selecionada = categoria.apelido == cat ? 'selecionada' : '';

        ficha.append( '<li class="' + selecionada + '">' + categoria.nome + ': ' + quantidade + '</li>' );  

      }

    }

    var semanaSelecionada = caso.sem == semanaAtual().numero ? 'selecionada' : '';
    var numeroCasos = caso[ cat ] === undefined ? 'sem dados' : caso[ cat ];
    var alturaBarra = caso[ cat ] > 1 ? caso[ cat ] / 2 : 1;

    grafico += '<li><span>' + numeroCasos + '</span><div class="barra ' + semanaSelecionada + '" data-caso-' + cat + '="' + numeroCasos + '" data-caso-sem="' + caso.sem + '" style="height:' + alturaBarra + 'px"></div><span>Semana ' + caso.sem + '</span></li>' ;
    
  }

  ficha.append( '<li class="grafico"><ol>' + grafico + '</ol></li>' );

}

function ultimo( data ) {

  if ( data == 'semana' )
    return dataDasSemanas[ 0 ].numero;

  if ( data == 'ano' )
    return dataDasSemanas[ 0 ].ano;

}

function desenhaCirculos() {

  $.getJSON( 'data/codigo-das-UF.json', function( dados ) {

    UFs = dados;

  });

  $.getJSON( 'data/lista-microcefalia-2016-10-07.json', function( dados ) {

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
          fillOpacity: 0.33,
          strokeColor: cor.circulo.normal,
          strokeWeight: 0

        }

      });

      circulo.addListener( 'click', function() {

        if ( selecionado ) {
          selecionado.setIcon({

            path: google.maps.SymbolPath.CIRCLE,
            scale: tamanho.selecionado, 
            fillColor: cor.circulo.normal,
            fillOpacity: 0.33,
            strokeColor: cor.circulo.normal,
            strokeWeight: 0

          });

        } 

        mostraFicha( this.indice, semanaAtual(), categoriaAtual() );

        selecionado = this;

        tamanho.selecionado = this.icon.scale;

        this.setIcon({

          path: google.maps.SymbolPath.CIRCLE,
          scale: tamanho.selecionado, 
          fillColor: cor.circulo.normal,
          fillOpacity: 0.75,
          strokeColor: cor.circulo.selecionado,
          strokeWeight: 1

        });
        
      });

      circulo.addListener( 'mouseover', function() {

        if ( this != selecionado ) {

          tamanho.outros = this.icon.scale;

          this.setIcon({

            path: google.maps.SymbolPath.CIRCLE,
            scale: tamanho.outros, 
            fillColor: cor.circulo.normal,
            fillOpacity: 0.66,
            strokeColor: cor.circulo.destaque,
            strokeWeight: 1

          });

        }

      });

      circulo.addListener( 'mouseout', function() {

        if ( this != selecionado ) {

          this.setIcon({

            path: google.maps.SymbolPath.CIRCLE,
            scale: tamanho.outros, 
            fillColor: cor.circulo.normal,
            fillOpacity: 0.33,
            strokeColor: cor.circulo.normal,
            strokeWeight: 0

          });

        }

      });

      circulos.push( circulo );

      for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

        caso = municipio.casos[ j ];

        semanas.push( caso.sem + '/' + caso.ano );

        if ( caso.sem == ultimo( 'semana' ) ) { // semana mais recente no geral

          for ( var k = 0, lenk = categorias.length; k < lenk; k++ ) {

            categoria = categorias[ k ];

            if ( caso[ categoria.apelido ] ) { // se este municipio tem dados sobre esta categoria em sua semana mais recente

              categoria.total += caso[ categoria.apelido ];

            }

          }

        }
        
      }

    }

    semanas = semanas.removeDuplicados().sort( function( a, b ) {

      return a.split( '/' ).reverse().join( '' ) - b.split( '/' ).reverse().join( '' );

    });

    for ( var i = 0, leni = semanas.length; i < leni; i++ ) {

      semana = semanas[ i ];
      semana = semana.split( '/' );
      semana = {
        "numero" : parseInt( semana[ 0 ] ),
        "ano" : parseInt( semana[ 1 ] )
      };

      var atual = i == leni - 1 ? ' selected' : '';

      $( 'select.semanas' ).append( '<option value="' + semana.numero + '/' + semana.ano + '"'+ atual +'>Semana ' + semana.numero + ' (' + dataDaSemana( semana.numero, semana.ano, 'inicio' ) + ' a ' + dataDaSemana( semana.numero, semana.ano, 'fim' ) + ')</option>' );

    }

    $( '.totais p' ).text( 'Até o dia ' + dataDaSemana( ultimo( 'semana' ), ultimo( 'ano' ), 'fim' ) + ':' );

    for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

      categoria = categorias[ i ];

      var atual = categoria.atual ? ' selected' : '';

      $( 'select.categorias' ).append( '<option value="' + categoria.apelido + '"'+ atual +'>' + categoria.nome + '</option>' );

      $( '.totais li[data-caso="' + categoria.apelido + '"]' ).text( categoria.nome + ': ' + categoria.total );

    }

    atualizaCirculos( semanaAtual(), categoriaAtual() );

    // criaGrafico( 'tc' );

  });

}

function criaMapa() {

  mapa = new google.maps.Map(document.getElementById('mapa'), {
    zoom: 5,
    minZoom: 5,
    center: new google.maps.LatLng(-15.474053, -53.290964),    
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"gamma":"0.00"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"lightness":"70"},{"gamma":"1.00"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#e6e6e6"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#cccccc"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"32"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"off"},{"lightness":"63"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#f2f2f2"}]}],
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
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

function maximo( tipo ) {

  return Math.max.apply( Math, municipios.map( function( municipio ) {

    return Math.max.apply( Math, municipio.casos.map( function( caso ) {

      return caso[ tipo ] ? caso[ tipo ] : 0;

    }));

  }));

}

function minimo( tipo ) {

  return Math.min.apply( Math, municipios.map( function( municipio ) {

    return Math.min.apply( Math, municipio.casos.map( function( caso ) {

      return caso[ tipo ] ? caso[ tipo ] : 0;

    }));

  }));

}

function criaGrafico( tipo ) {

  var max = maximo( tipo );
  var min = minimo( 'sem' );

  var scale = {
    x : 20,
    y : 4
  }

  var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
      svg.setAttribute( 'version', '1.1' );
      svg.setAttribute( 'id', 'grafico-linhas' );
      svg.setAttribute( 'x', '0' );
      svg.setAttribute( 'y', '0' );
      svg.setAttribute( 'width', ( ( maximo( 'sem' ) - min ) * scale.x ) + ( scale.x * 2 ) );
      svg.setAttribute( 'height', ( max * scale.y ) + ( scale.y * 2) );
      svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' ); // http://www.w3.org/2000/xmlns/

  var linhas = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
      linhas.setAttribute( 'id', 'linhas' );

  for ( var i = 0; i < municipios.length; i++ ) {

    var municipio = municipios[ i ];

    var grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute( 'id', municipio.nome );

    if ( municipio.casos.length > 3 ) {

      for ( var j = 0; j < ( municipio.casos.length - 1 ); j++ ) {

        var caso = municipio.casos[ j ];

        var temCasos = false;

        if ( caso[ tipo ] ) {

          var opacidade = ( 1 / max * caso[ tipo ] );

          var linha = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              linha.setAttribute( 'fill', 'none' );
              linha.setAttribute( 'stroke', '#000' );
              linha.setAttribute( 'stroke-width', '3' );
              linha.setAttribute( 'stroke-linecap', 'round' );
              linha.setAttribute( 'stroke-linejoin', 'round' );
              linha.setAttribute( 'opacity', opacidade );
              linha.setAttribute( 'x1', ( ( caso.sem - (min - 1) ) * scale.x ) );
              linha.setAttribute( 'x2', ( ( municipio.casos[ j + 1 ].sem - (min - 1) ) * scale.x ) );
              linha.setAttribute( 'y1', ( ( ( max + 1 ) - caso[ tipo ] ) * scale.y )  );
              linha.setAttribute( 'y2', ( municipio.casos[ j + 1 ][ tipo ] ? ( ( ( max + 1 ) - municipio.casos[ j + 1 ][ tipo ] ) * scale.y ) : ( ( ( max + 1 ) - caso[ tipo ] ) * scale.y ) ) );
              
            grupo.appendChild( linha );
            temCasos = true;

        }

        if ( temCasos ) {

          linhas.appendChild( grupo );

        }

      }

    }

  }

  svg.appendChild( linhas );
  document.getElementById( 'grafico-linhas' ).appendChild( svg );

}

function baixar( id, nome ) {

  var
    svg = document.getElementById( id ).innerHTML,
    blob = new Blob( [ svg ], { 'type' : 'image/svg+xml' } ),
    a = document.createElement( 'a' );

    a.download = nome + '.svg';
    a.type = 'image/svg+xml';
    a.href = ( window.URL || webkitURL ).createObjectURL( blob );
    a.click();
    
}
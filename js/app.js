// $.getJSON( caminho + 'data/lista-microcefalia-2016-08-21.json', function( resultado ) {
//     $.each( resultado, function( chave, municipio ) {
//       console.log( municipio );
//     });
// });


// checar se a lista de municípios com coordenadas contém duplicatas
var coordenadasUnicas = [];

$.getJSON( caminho + 'data/br-localidades-2010-v1.json', function( cidades ) {

  $.each( cidades, function( i, cidade ) {

    if ( $.inArray( cidade[ 'id-ibge' ], coordenadasUnicas) > -1 ) { // se já consta o ID do município no array de únicos

      console.log( 'repetido: ' + cidade[ 'id-ibge' ] );

    } else { // se não consta

      coordenadasUnicas.push( cidade[ 'id-ibge' ] );

    }
  
  });

});










var municipiosUnicos = [];
var municipios = [];
var reali = 0;

$.getJSON( caminho + 'data/lista-microcefalia-2016-08-21.json', function( resultado ) {

    $.each( resultado.resultset, function( i, dados ) {

      var id = parseInt( dados[0] );

      if ( $.inArray( id, municipiosUnicos) > -1 ) { // se já consta o ID do município no array de únicos

        var caso = { 

          "ano"  : parseInt( dados[4] ),
          "sem"  : parseInt( dados[3] ),
          "ta" : parseInt( dados[5] ),
          "ti" : parseInt( dados[6] ),
          "tc" : parseInt( dados[7] ),
          "td" : parseInt( dados[8] ),
          "ton" : parseInt( dados[9] ),
          "toi" : parseInt( dados[10] ),
          "toc" : parseInt( dados[11] ),
          "tod" : parseInt( dados[12] )

        }

        municipios[reali - 1][ 'casos' ].push( caso );

      } else { // se não consta

        municipiosUnicos.push( id );

        municipios[reali] = {

          "id"      : id,
          "nome"    : dados[2],
          "casos"   : []

        };

        var caso = {

          "ano"  : parseInt( dados[4] ),
          "sem"  : parseInt( dados[3] ),
          "ta" : parseInt( dados[5] ),
          "ti" : parseInt( dados[6] ),
          "tc" : parseInt( dados[7] ),
          "td" : parseInt( dados[8] ),
          "ton" : parseInt( dados[9] ),
          "toi" : parseInt( dados[10] ),
          "toc" : parseInt( dados[11] ),
          "tod" : parseInt( dados[12] )

        }

        municipios[reali][ 'casos' ].push( caso );

        lasti = i;
        reali++;

      }

    });

    $( 'body' ).html( JSON.stringify( municipios ) );

});
















/*
$.each( UFs , function( i, uf ) {
  $( 'body' ).append( uf[ 'sigla'] + ', ' + uf[ 'id' ] + ', ' + uf[ 'nome' ] + '<br>' );
});

$( 'body' ).append( '<hr>' );

$.getJSON( caminho + 'data/codigo-dos-municipios.json', function( resultado ) {
    $.each( resultado, function( indice, municipio ) {
      markup += municipio[ 'UF' ] + ', ' + municipio[ 'Código' ] + ', ' + municipio[ 'Nome' ] + '<br>';
    });
    $( 'body' ).append( markup );
});

$.getJSON( caminho + 'data/lista-microcefalia-2016-08-21.json', function( resultado ) {
    $.each( resultado, function( indice, municipio ) {
      // pegar os dados aqui
    });
});
*/
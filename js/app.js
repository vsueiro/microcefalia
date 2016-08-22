$.each( UFs , function( i, uf ) {
  $( 'body' ).append( uf[ 'sigla'] + ', ' + uf[ 'id' ] + ', ' + uf[ 'nome' ] + '<br>' );
} ) ;

$( 'body' ).append( '<hr>' );

$.getJSON( caminho + 'data/codigo-dos-municipios.json', function( resultado ) {
    $.each( resultado, function( indice, municipio ) {
      markup += municipio[ 'UF' ] + ', ' + municipio[ 'Código' ] + ', ' + municipio[ 'Nome' ] + '<br>';
    } );
    $( 'body' ).append( markup );
} );

$.getJSON( caminho + 'data/lista-microcefalia-2016-08-21.json', function( resultado ) {
    $.each( resultado, function( indice, municipio ) {
      // pegar os dados aqui
    } );
} );

carregaMapa();

$( document ).on( 'change', '.semanas, .categorias', function() {

  atualizaCirculos( semanaAtual(), categoriaAtual() );

});
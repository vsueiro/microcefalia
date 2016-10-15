carregaMapa();

$( document ).on( 'change', '.semanas, .categorias', function() {

	atualizaCirculos( semanaAtual(), categoriaAtual() );

	if ( visualizacao.data( 'ficha' ) ) {

		mostraFicha( visualizacao.data( 'municipio' ), semanaAtual(), categoriaAtual() );

	}

});
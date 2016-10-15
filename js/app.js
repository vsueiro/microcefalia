carregaMapa();

$( document ).on( 'change', '.semanas, .categorias', function() {

	atualizaCirculos( semanaAtual(), categoriaAtual() );

	deslizador.setStep( $( 'select.semanas option:selected' ).index(), 0 );

	if ( visualizacao.data( 'ficha' ) ) {

		mostraFicha( visualizacao.data( 'municipio' ), semanaAtual(), categoriaAtual() );

	}

});
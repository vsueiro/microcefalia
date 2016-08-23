<?php

	// extrair coordenadas e código do município a partir do KML do IBGE
	{
	  $xml = simplexml_load_file('data/br-localidades-2010-v1.kml');

	  $quantidadeDeLocais = 0;

	  foreach ( $xml->Document->Folder->Placemark as $lugar ) {

	    $dados = $lugar->ExtendedData->SchemaData->SimpleData;

	    echo
	      '{<br>'.
	        '"id-ibge" : ' . $dados[ 9 ] . ',<br>'.       //  9 CD_GEOCODMU
	        '"nome" : "' . $dados[ 17 ] . '",<br>'.       // 17 NM_LOCALIDADE
	        '"longitude" : "' . $dados[ 18 ] . '",<br>'.  // 18 LONG
	        '"latitude" : "' . $dados[ 19 ] . '",<br>'.   // 19 LAT
	        '"altitude" : "' . $dados[ 20 ] . '"<br>'.    // 20 ALT
	      '},<br>'
	    ;

	    $quantidadeDeLocais++;

	  }
	}
var
  caminho = window.location.protocol + '//' + window.location.host + window.location.pathname,
  quantidade = 0
;

caminho = caminho.substring( 0, caminho.lastIndexOf( '/' ) + 1 );

function cleanCSV( data ) {

  var csv = 'id,nome,latitude,longitude,ano,sem,ta<br>';

  $.each( data, function( i, m ) {

    var casoMaisRecente = m.casos[ m.casos.length - 1 ];

    var ano = casoMaisRecente.ano;
    var sem = casoMaisRecente.sem;
    var ta  = casoMaisRecente.ta;

    // precisa adicionar todas as categorias em todas as semanas

    if ( ta > 0 ) {

      csv += m[ 'id' ] + ',' + m.nome + ',' + m.coordenadas.lat + ',' + m.coordenadas.lon + ',' + ano + ',' + sem + ',' + ta + '<br>';
      quantidade++;

    }

  });

  console.log( 'csv retornou ' + quantidade + ' municípios' );

  return csv; 

}

function clean( json, format ) {

  console.log( 'Carregando JSON de coordenadas...' );

  var municipiosCoordenadas;

  $.getJSON( caminho + 'data/br-localidades-2010-v1.json', function( dados ) {

    municipiosCoordenadas = dados;

  });

  console.log( 'Carregandon JSON com casos de microcefalia e zika...' );  

  var municipiosUnicos = [];
  var municipios = [];
  var reali = 0;

  $.getJSON( json, function( resultado ) {

      $.each( resultado.resultset, function( i, dados ) {

        var id = parseInt( dados[0] );

        if ( $.inArray( id, municipiosUnicos) > -1 ) { // se já consta o ID do município no array de únicos

          var caso = { 

            "ano" : parseInt( dados[4]  ),
            "sem" : parseInt( dados[3]  ),
            "ta"  : parseInt( dados[5]  ),
            "ti"  : parseInt( dados[6]  ),
            "tc"  : parseInt( dados[7]  ),
            "td"  : parseInt( dados[8]  ),
            "ton" : parseInt( dados[9]  ),
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

            "ano" : parseInt( dados[4]  ),
            "sem" : parseInt( dados[3]  ),
            "ta"  : parseInt( dados[5]  ),
            "ti"  : parseInt( dados[6]  ),
            "tc"  : parseInt( dados[7]  ),
            "td"  : parseInt( dados[8]  ),
            "ton" : parseInt( dados[9]  ),
            "toi" : parseInt( dados[10] ),
            "toc" : parseInt( dados[11] ),
            "tod" : parseInt( dados[12] )

          }

          municipios[reali][ 'casos' ].push( caso );

          lasti = i;
          reali++;

        }

      });

      console.log( 'Mesclando as duas bases de dados...' );  

      $.each( municipios, function( i, municipio ) {

        var found = false; 

        $.each( municipiosCoordenadas, function( j, municipiosCoordenada ) {

          var trimId = '';
              trimId += municipiosCoordenada[ 'id-ibge' ];
              trimId = trimId.slice(0, -1); // remove último dígito

          if ( municipio[ 'id' ] == trimId ) {

            municipio[ 'geo' ] = {

              "lat" : parseFloat( municipiosCoordenada[ 'latitude'  ] ),
              "lng" : parseFloat( municipiosCoordenada[ 'longitude' ] )

            };

            found = true;

          }

        });

        if ( !found ) {

          console.log( 'não encontrado: ' + municipio[ 'id' ] );

        }

      });

      /* DESCOMENTAR 

      if ( format == 'json' ) {
      
        $( 'body' ).html( JSON.stringify( municipios ) ); // JSON completo para download (com dados zerados e quantidades acumuladas)

      }

      if ( format == 'csv'  ) {

        $( 'body' ).html( cleanCSV( municipios ) );

      }

      */
      
      $.each( municipios, function( i, municipio ) { // remover dados zerados

        $.each( municipio.casos, function( j, caso ) {

          if (caso.ta == 0) {
            // console.log( 'deletado caso.ta (' + caso.ta + ')' );
            delete caso.ta;
          }
          if (caso.ti == 0) {
            // console.log( 'deletado caso.ti (' + caso.ti + ')' );
            delete caso.ti;
          }
          if (caso.tc == 0) {
            // console.log( 'deletado caso.tc (' + caso.tc + ')' );
            delete caso.tc;
          }
          if (caso.td == 0) {
            // console.log( 'deletado caso.td (' + caso.td + ')' );
            delete caso.td;
          }
          if (caso.ton == 0) {
            // console.log( 'deletado caso.ton (' + caso.ton + ')' );
            delete caso.ton;
          }
          if (caso.toi == 0) {
            // console.log( 'deletado caso.toi (' + caso.toi + ')' );
            delete caso.toi;
          }
          if (caso.toc == 0) {
            // console.log( 'deletado caso.toc (' + caso.toc + ')' );
            delete caso.toc;
          }
          if (caso.tod == 0) {
            // console.log( 'deletado caso.tod (' + caso.tod + ')' );
            delete caso.tod;
          }

        });

      });

      if ( format == 'json' ) {
      
        $( 'body' ).html( JSON.stringify( municipios ) ); // JSON para a visualização (com dados zerados e quantidades acumuladas)

      }

      // transformar dados acumulados em dados para cada semana individualmente

  });

}

clean( caminho + 'data/lista-microcefalia-2016-08-21.json', 'json' );
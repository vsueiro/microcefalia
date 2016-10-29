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
    var tn  = casoMaisRecente.tn;

    // precisa adicionar todas as categorias em todas as semanas

    if ( tn > 0 ) {

      csv += m[ 'id' ] + ',' + m.nome + ',' + m.coordenadas.lat + ',' + m.coordenadas.lon + ',' + ano + ',' + sem + ',' + tn + '<br>';
      quantidade++;

    }

  });

  console.log( 'csv retornou ' + quantidade + ' municípios' );

  return csv; 

}

function clean( json, format ) {

  console.log( 'Carregando JSON de coordenadas...' );

  var municipiosCoordenadas;

  $.getJSON( caminho + 'data/br-localidades-2010.json', function( dados ) {

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
            "n"  : parseInt( dados[5]  ),
            "i"  : parseInt( dados[6]  ),
            "c"  : parseInt( dados[7]  ),
            "d"  : parseInt( dados[8]  ),
            "on" : parseInt( dados[9]  ),
            "oi" : parseInt( dados[10] ),
            "oc" : parseInt( dados[11] ),
            "od" : parseInt( dados[12] )

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
            "n"  : parseInt( dados[5]   ),
            "i"  : parseInt( dados[6]   ),
            "c"  : parseInt( dados[7]   ),
            "d"  : parseInt( dados[8]   ),
            "on" : parseInt( dados[9]   ),
            "oi" : parseInt( dados[10]  ),
            "oc" : parseInt( dados[11]  ),
            "od" : parseInt( dados[12]  )

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
      
      // remover casos e municípios zerados
      {
        var i = municipios.length;

        while ( i-- ) {

          var j = municipios[ i ].casos.length;
          var empty = true;

          while ( j-- ) {

            var caso = municipios[ i ].casos[ j ];

            if ( caso.n  == 0 ) delete caso.n;
            if ( caso.i  == 0 ) delete caso.i;
            if ( caso.c  == 0 ) delete caso.c;
            if ( caso.d  == 0 ) delete caso.d;
            if ( caso.on == 0 ) delete caso.on;
            if ( caso.oi == 0 ) delete caso.oi;
            if ( caso.oc == 0 ) delete caso.oc;
            if ( caso.od == 0 ) delete caso.od;

            { // deixar apenas casos e óbitos confirmados

              if ( caso.n ) delete caso.n;
              if ( caso.i ) delete caso.i;
              if ( caso.d ) delete caso.d;
              if ( caso.on ) delete caso.on;
              if ( caso.oi ) delete caso.oi;
              if ( caso.od ) delete caso.od;

            }

            if ( Object.keys( caso ).length > 2 ) {
              
              empty = false;

            } else {

              municipios[ i ].casos.splice( j, 1 );

            }

          }

          if ( empty ) {

            console.log( 'municípios foram removidos' );
            municipios.splice( i, 1 );

          }

        }
      }

      if ( format == 'json' ) {
      
        $( 'body' ).html( JSON.stringify( municipios ) ); // JSON para a visualização (com dados zerados e quantidades acumuladas)

      }

  });

}

clean( caminho + 'data/microcefalia.json', 'json' );
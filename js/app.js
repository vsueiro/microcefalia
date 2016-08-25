var amount = 0;

function cleanCSV( data ) {

  var csv = 'id,nome,latitude,longitude,ano,sem,ta<br>';

  $.each( data, function( i, m ) {

    var casoMaisRecente = m.casos[ m.casos.length - 1 ];

    var ano = casoMaisRecente.ano;
    var sem = casoMaisRecente.sem;
    var ta  = casoMaisRecente.ta;    

    if ( ta > 0 ) {

      csv += m[ 'id' ] + ',' + m.nome + ',' + m.coordenadas.lat + ',' + m.coordenadas.lon + ',' + ano + ',' + sem + ',' + ta + '<br>';
      amount++;

    }

  });

  console.log( 'csv retornou ' + amount + ' municípios' );

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

        if ( $.inArray( id, municipiosUnicos) > -1 ) {
        // se já consta o ID do município no array de únicos

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

            municipio[ 'coordenadas' ] = {

              "lat" : municipiosCoordenada[ 'latitude'  ],
              "lon" : municipiosCoordenada[ 'longitude' ]

            };

            found = true;

          }

        });

        if ( !found ) {

          console.log( 'não encontrado: ' + municipio[ 'id' ] );

        }

      });

      if ( format == 'json' ) {
      
        $( 'body' ).html( JSON.stringify( municipios ) );

      }

      if ( format == 'csv'  ) {

        $( 'body' ).html( cleanCSV( municipios ) );

      }

  });

}

clean( caminho + 'data/lista-microcefalia-2016-08-21.json', 'csv' );
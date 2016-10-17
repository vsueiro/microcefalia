//   totais,
//   total,
//   municipios,
//   municipio,
//   circulos,
//   circulo,
//   semanas,
//   semana,
//   caso,
//   mapa,
//   ficha,
//   categorias,
//   categoria,
//   cor,
//   consta,
//   dataDasSemanas,
//   meses,
//   visualizacao,
//   selecionado,
//   tamanho,
//   amplitude,
//   deslizador


// var municipio,
//     circulo;


var vis = {

  dados : {},

  carrega : {

    script : function( url ) {

      var script = document.createElement( 'script' );
          script.type = 'text/javascript';
          script.src = '//' + url;
          document.body.appendChild( script );

    },

    dados : function( variavel, url, callback ) {

        callback = callback || null;

        $.getJSON( url, function( dados ) {

          vis.dados[ variavel ] = dados;

        }).done( callback );

    }

  },

  dependencias : [

    {
      nome : 'Google Maps',
      tipo : 'script',      
      url : 'maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs&callback=vis.mapa.criar'
    }

  ],

  sobre : {

    titulo : 'Microcefalia em recém-nascidos no Brasil',
    descricao : 'O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos',

  },

  elemento : $( '.visualizacao' ),

  ultimo : function( data ) {

    if ( data == 'semana' ) return vis.dados.semanas[ 0 ].numero;
    if ( data == 'ano'    ) return vis.dados.semanas[ 0 ].ano;

  },

  mapa : {

    elemento : $( '#mapa' ),

    circulos : { 

      lista : [],

      amplitude : 7.5,

      cor : {
 
        normal : '#333',
        destaque : '#222',
        selecionado : '#000'

      },

      criar : function() {

        municipios = vis.dados.municipios;

        for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

          municipio = municipios[ i ];

          circulo = new google.maps.Marker({

            indice: i,
            id: municipio.id,
            map: vis.mapa.objeto,
            title: municipio.nome,
            position: municipio.geo,
            icon: {

              path: google.maps.SymbolPath.CIRCLE,
              scale: 1, // mudar para 0
              fillColor: vis.mapa.circulos.cor.normal,
              fillOpacity: 0.33,
              strokeColor: vis.mapa.circulos.cor.normal,
              strokeWeight: 0

            }

          });

          circulo.addListener( 'click', function() {

            if ( vis.mapa.circulos.selecionado ) {

              vis.mapa.circulos.selecionado.setIcon({

                path: google.maps.SymbolPath.CIRCLE,
                scale: tamanho.selecionado, 
                fillColor: vis.mapa.circulos.cor.normal,
                fillOpacity: 0.33,
                strokeColor: vis.mapa.circulos.cor.normal,
                strokeWeight: 0

              });

            } 

            mostraFicha( this.indice, semanaAtual(), categoriaAtual() );

            vis.mapa.circulos.selecionado = this;

            vis.mapa.circulos.selecionado.tamanho = this.icon.scale;

            this.setIcon({

              path: google.maps.SymbolPath.CIRCLE,
              scale: vis.mapa.circulos.selecionado.tamanho, 
              fillColor: vis.mapa.circulos.cor.normal,
              fillOpacity: 0.75,
              strokeColor: vis.mapa.circulos.cor.selecionado,
              strokeWeight: 1

            });
            
          });

          circulo.addListener( 'mouseover', function() {

            if ( this != vis.mapa.circulos.selecionado ) {

              vis.mapa.circulos.tamanho = this.icon.scale;

              this.setIcon({

                path: google.maps.SymbolPath.CIRCLE,
                scale: vis.mapa.circulos.tamanho, 
                fillColor: vis.mapa.circulos.cor.normal,
                fillOpacity: 0.66,
                strokeColor: vis.mapa.circulos.cor.destaque,
                strokeWeight: 1

              });

            }

          });

          circulo.addListener( 'mouseout', function() {

            if ( this != vis.mapa.circulos.selecionado ) {

              this.setIcon({

                path: google.maps.SymbolPath.CIRCLE,
                scale: vis.mapa.circulos.tamanho, 
                fillColor: vis.mapa.circulos.cor.normal,
                fillOpacity: 0.33,
                strokeColor: vis.mapa.circulos.cor.normal,
                strokeWeight: 0

              });

            }

          });

          vis.mapa.circulos.lista.push( circulo );

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

            caso = municipio.casos[ j ];

            // vis.semanas.push( caso.sem + '/' + caso.ano );

            if ( caso.sem == vis.ultimo( 'semana' ) ) { // semana mais recente no geral

              for ( var k = 0, lenk = vis.dados.categorias.length; k < lenk; k++ ) {

                categoria = vis.dados.categorias[ k ];

                if ( categoria.visivel && caso[ categoria.apelido ] ) { // se este municipio tem dados sobre esta categoria em sua semana mais recente

                  categoria.total += caso[ categoria.apelido ];

                }

              }

            }
            
          }

        }

        vis.filtros.criar()
        
      }

    },

    criar : function() {

      this.objeto = new google.maps.Map( this.elemento[ 0 ], {

        zoom: 5,
        minZoom: 5,
        center: new google.maps.LatLng( -15.474053, -53.290964 ),    
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
      
      vis.carrega.dados( 

        'semanas',
        'data/semanas.json',

        vis.carrega.dados(

          'UFs',
          'data/UFs.json', 

          vis.carrega.dados(

            'categorias',
            'data/categorias.json',

            vis.carrega.dados(

              'municipios',
              'data/microcefalia-2016-10-07.json',
              vis.mapa.circulos.criar

            )

          )

        )

      )

    }

  },

  graficos : {},

  filtros : {

    elemento : $( '.filtros' ),

    semana : {

      meses : [

        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro'

      ],

      quando : function( data ) {

        data = data.split( '-' );

        dia = parseInt( data[ 2 ] );
        mes = this.meses[ parseInt( data[ 1 ] ) - 1 ];
        ano = data[ 0 ];

        return dia + ' de ' + mes;
              
      },

      criar : function( el ) {

        seletor = document.createElement( 'select' );

        grupos = {};

        vis.dados.semanas.forEach( function( semana ) {

          ano = semana.ano;

          texto = vis.filtros.semana.quando( semana.inicio ) + ' a ' + vis.filtros.semana.quando( semana.fim );

          mes = texto.match( /de\s+\w+/gi );

          if ( mes[ 0 ] == mes[ 1 ] ) {

            texto = texto.replace( /de\s+\w+/i , '' )

          }

          opcao = document.createElement( 'option' );
          opcao.value = semana.numero + '/' + ano;
          opcao.text = texto;

          if ( ano in grupos ) {

          } else {

            grupos[ ano ] = document.createElement( 'optgroup' );
            grupos[ ano ].label = ano;

          }

          grupos[ ano ].appendChild( opcao );

        });

        ordem = [];

        for ( ano in grupos ) {

          ordem.push( ano );

        }

        ordem.sort().reverse().forEach( function( ano ) {

          seletor.appendChild( grupos[ ano ] );

        });

        el.append( seletor )

      }

    },

    categoria : {

      criar : function( el ) {

        el.append( '<div>categoria</div>' )

      }

    },

    criar : function( ) {

      el = this.elemento;

      this.semana.criar( el );
      this.categoria.criar( el );

    }

  },

  iniciar : function() {

    for ( var i = 0; i < this.dependencias.length; i ++ ) {

      var dependencia = this.dependencias[ i ];

      this.carrega[ dependencia.tipo ]( dependencia.url );

    }

  }

};

vis.iniciar();
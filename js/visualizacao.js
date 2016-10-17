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

  elemento : '.visualizacao',

  atual : {

    semana : function() {

      semana = $( vis.filtros.semana.elemento ).val().split( '/' );

      return {
        'numero' : parseInt( semana[ 0 ] ),
        'ano'    : parseInt( semana[ 1 ] )
      }

    },

    categoria : function() {

      // temp
      return 'tc'

    },

  },

  mapa : {

    elemento : '#mapa',

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
                scale: vis.mapa.circulos.selecionado.tamanho, 
                fillColor: vis.mapa.circulos.cor.normal,
                fillOpacity: 0.33,
                strokeColor: vis.mapa.circulos.cor.normal,
                strokeWeight: 0

              });

            } 

            vis.fichas.atualizar( this.indice );

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

        vis.filtros.criar();
        vis.fichas.criar();
        vis.mapa.circulos.atualizar( vis.atual.semana(), vis.atual.categoria() );
        
      },

      atualizar : function( sem, cat ) {

        circulos = vis.mapa.circulos.lista;

        for ( var i = 0, leni = circulos.length; i < leni; i++ ) { // para cada círculo no mapa

          circulo = circulos[ i ];
          municipio = municipios[ i ];
          consta = false;

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) { // para cada caso do respectivo município

            caso = municipio.casos[ j ];

            if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

              if ( circulo == vis.mapa.circulos.selecionado ) {

                console.log( vis.mapa.circulos.amplitude );

                circulo.setIcon({

                  path: google.maps.SymbolPath.CIRCLE,
                  scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * vis.mapa.circulos.amplitude, 
                  fillColor: vis.mapa.circulos.cor.normal,
                  fillOpacity: 0.75,
                  strokeColor: vis.mapa.circulos.cor.selecionado,
                  strokeWeight: 1

                });

              } else {

                circulo.setIcon({

                  path: google.maps.SymbolPath.CIRCLE,
                  scale: Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * vis.mapa.circulos.amplitude, 
                  fillColor: vis.mapa.circulos.cor.normal,
                  fillOpacity: 0.33,
                  strokeColor: vis.mapa.circulos.cor.normal,
                  strokeWeight: 0

                });

              }

              consta = true;

              break;

            }

          }

          if ( !consta ) { // se não há informação, zera o círculo

            circulo.setIcon({

              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, 
              fillColor: vis.mapa.circulos.cor.normal,
              fillOpacity: 0.33,
              strokeColor: vis.mapa.circulos.cor.normal,
              strokeWeight: 0

            });

          }

        }

      }

    },

    criar : function() {

      this.objeto = new google.maps.Map( $( this.elemento )[ 0 ], {

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

  graficos : {

    evolucao : function( local ) {

      if ( local == 'todos' ) {

        linhas = '';
        totais = vis.dados.totais;

        for ( var i = 0, leni = totais.length; i < leni; i++ ) { // para cada semana epidemiológica do Brasil

          total = totais[ i ];

          unicos = total.casos.unicos;

          linhas += '<li><span>' + unicos.tc + '</span><div class="barra" data-caso-' + caso + '="' + unicos.tc + '" data-caso-sem="' + total.sem + '" style="height:' + unicos.tc + 'px"></div><span>Semana ' + total.sem + '</span></li>' ;

        }

        return '<ol>' + linhas + '</ol>';

      } else {

        linhas    = '';
        municipio = vis.dados.municipios[ local ];
        casos     = municipio.casos;
        
        if ( !vis.iniciou ) {
          
          semanas = vis.dados.semanas.reverse();
          vis.iniciou = true;

        }

        for ( var i = 0, leni = semanas.length; i < leni; i++ ) {

          semana = semanas[ i ]      

          consta = false;

          for ( var j = 0, lenj = casos.length; j < lenj; j++ ) { // para cada semana epidemiológica do Brasil

            caso = casos[ j ];

            if ( semana.numero == caso.sem && semana.ano == caso.ano ) {

              linhas += '<li><span>' + caso.tc + '</span><div class="barra" data-caso-' + 'tc' + '="' + caso.tc + '" data-caso-sem="' + semana.numero + '" style="height:' + caso.tc + 'px"></div><span>Semana ' + semana.numero + '</span></li>' ;

              consta = true;

              break;

            }

          }

          if ( !consta ) {

            linhas += '<li><span>' + 'Sem dados' + '</span><div class="barra" data-caso-' + 'tc' + '="' + 'Sem dados' + '" data-caso-sem="' + semana.numero + '" style="height:' + 0 + 'px"></div><span>Semana ' + semana.numero + '</span></li>' ;

          }

        }

        return '<ol>' + linhas + '</ol>';

        // var grafico = '';

        // for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) { // para cada semana epidemiológica do município

        //   caso = municipio.casos[ i ];

        //   if ( caso.sem == sem.numero ) {

        //     for ( var j = 0, lenj = categorias.length; j < lenj; j++ ) {

        //       categoria = categorias[ j ];

        //       if ( categoria.visivel ) {

        //         var quantidade  = caso[ categoria.apelido ] || 0,
        //             selecionada = categoria.apelido == cat ? 'selecionada' : '';

        //         ficha.append( '<li class="' + selecionada + '">' + categoria.nome + ': ' + quantidade + '</li>' );  

        //       }

        //     }

        //   }

        //   var semanaSelecionada = caso.sem == semanaAtual().numero ? 'selecionada' : '';
        //   var numeroCasos = caso[ cat ] === undefined ? 'sem dados' : caso[ cat ];
        //   var alturaBarra = caso[ cat ] > 1 ? caso[ cat ] / 2 : 1;

        //   grafico += '<li><span>' + numeroCasos + '</span><div class="barra ' + semanaSelecionada + '" data-caso-' + cat + '="' + numeroCasos + '" data-caso-sem="' + caso.sem + '" style="height:' + alturaBarra + 'px"></div><span>Semana ' + caso.sem + '</span></li>' ;
          
        // }

        // ficha.append( '<li class="grafico"><ol>' + grafico + '</ol></li>' );

        return 'grafico do municipio'

      }

    }

  },

  fichas : {

    elemento : '.fichas',

    ativo : false,

    items : {

      local : function( local ) {

        if ( local == 'todos' ) {

          return 'Brasil'

        } else {

          municipio = vis.dados.municipios[ local ];
        
          return municipio.nome;

        }

      },

      UF : function( local ) {

        if ( local == 'todos' ) {

          return '–'

        } else {

          municipio = vis.dados.municipios[ local ];

          return vis.UF( municipio.id, 'nome' )

        }

      },

      data : function( local ) {

        sem = vis.atual.semana();

        for ( var i = 0, leni = vis.dados.semanas.length; i < leni; i++ ) {

          semana = vis.dados.semanas[ i ];

          if ( semana.numero == sem.numero && semana.ano == sem.ano ) {

            return 'Até ' + vis.filtros.semana.quando( semana.fim );

          }

        }

      },

      casos : function( local ) {

        sem = vis.atual.semana();

        if ( local == 'todos' ) {

          totais = vis.dados.totais;

          for ( var i = 0, leni = totais.length; i < leni; i++ ) {

            total = totais[ i ];

            if ( total.ano == sem.ano && total.sem == sem.numero ) {

              tc   = total.casos.acumulados.tc || 0;
              toc = total.casos.acumulados.toc || 0;

              return 'Casos confirmados: ' + tc + '<br>Óbitos confirmados: ' + toc

            }

          }

        } else {

          municipio = vis.dados.municipios[ local ];

          for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) {

            caso = municipio.casos[ i ];

            if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

              return 'Casos confirmados: ' + ( caso.tc || 0 ) + '<br>Óbitos confirmados: ' + ( caso.toc || 0 )

            }

          }

        }

      },

      grafico : function( local ) {

        return vis.graficos.evolucao( local )

      }

    },

    criar : function() {

      lista = $( '<ul/>' ).appendTo( this.elemento );

      for ( nome in this.items ) {

        lista.append( '<li data-item="' + nome + '"></li>' );

      }

      this.atualizar()

    },

    totais : function() {

      vis.dados.totais = [];
  
      totais = vis.dados.totais;

      semanas = vis.dados.semanas;

      for ( var i = 0, leni = semanas.length; i < leni; i++ ) { // soma números acumulados por semana

        semana = semanas[ i ];

        totais[ i ] = {

          ano : semana.ano,
          sem : semana.numero,
          casos : {

            acumulados : {},
            unicos : {}

          }

        };

        categorias = vis.dados.categorias;

        for ( var j = 0, lenj = categorias.length; j < lenj; j++ ) {

          categoria = categorias[ j ];

          if ( categoria.visivel ) {

            totais[ i ].casos.acumulados[ categoria.apelido ] = 0; 

            municipios = vis.dados.municipios;

            for ( var k = 0, lenk = municipios.length; k < lenk; k++ ) {

              municipio = municipios[ k ];

              for ( var l = 0, lenl = municipio.casos.length; l < lenl; l++ ) {

                caso = municipio.casos[ l ];

                if ( caso.ano == semana.ano && caso.sem == semana.numero ) {

                  if ( categoria.apelido in caso ) {

                    totais[ i ][ 'casos' ][ 'acumulados' ][ categoria.apelido ] += caso[ categoria.apelido ];

                  }

                  break;

                }
                
              }

            }

          }

        }

      }

      totais = totais.reverse();

      for ( var i = 0, leni = totais.length; i < leni; i++ ) { // calcula números específicos de cada semana

        total = totais[ i ];

        anterior = 0;

        for ( caso in total.casos.acumulados ) {

          if ( i > 0 ) {

            anterior = totais[ i - 1 ].casos.acumulados[ caso ];

          }

          total.casos.unicos[ caso ] = total.casos.acumulados[ caso ] - anterior;

        }

      }

    },

    atualizar : function( local ) {

      if ( !local ) {

        local = 'todos';
        this.totais();

      }

      vis.fichas.ativo = true;
      vis.atual.municipio = local;

      for ( nome in this.items ) {

        conteudo = this.items[ nome ]( local );

        $( '[data-item="' + nome + '"]' ).html( conteudo )

      }

      // var grafico = '';

      // for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) { // para cada semana epidemiológica do município

      //   caso = municipio.casos[ i ];

      //   if ( caso.sem == sem.numero ) {

      //     for ( var j = 0, lenj = categorias.length; j < lenj; j++ ) {

      //       categoria = categorias[ j ];

      //       if ( categoria.visivel ) {

      //         var quantidade  = caso[ categoria.apelido ] || 0,
      //             selecionada = categoria.apelido == cat ? 'selecionada' : '';

      //         ficha.append( '<li class="' + selecionada + '">' + categoria.nome + ': ' + quantidade + '</li>' );  

      //       }

      //     }

      //   }

      //   var semanaSelecionada = caso.sem == semanaAtual().numero ? 'selecionada' : '';
      //   var numeroCasos = caso[ cat ] === undefined ? 'sem dados' : caso[ cat ];
      //   var alturaBarra = caso[ cat ] > 1 ? caso[ cat ] / 2 : 1;

      //   grafico += '<li><span>' + numeroCasos + '</span><div class="barra ' + semanaSelecionada + '" data-caso-' + cat + '="' + numeroCasos + '" data-caso-sem="' + caso.sem + '" style="height:' + alturaBarra + 'px"></div><span>Semana ' + caso.sem + '</span></li>' ;
        
      // }

      // ficha.append( '<li class="grafico"><ol>' + grafico + '</ol></li>' );

    }

  },

  filtros : {

    elemento : '.filtros',

    semana : {

      elemento : '.semanas',

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

        return dia + ' de ' + mes + ' de ' + ano;
              
      },

      criar : function( el ) {

        seletor = document.createElement( 'select' );
        seletor.className = 'semanas';

        grupos = {};

        vis.dados.semanas.forEach( function( semana ) {

          ano = semana.ano;

          texto = vis.filtros.semana.quando( semana.inicio );
          texto += ' a ';
          texto += vis.filtros.semana.quando( semana.fim );
          texto = texto.replace( /de\s+\d{4}/gi ,'' );

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

        $( el ).append( seletor );

        $( vis.filtros.semana.elemento ).val( $( vis.filtros.semana.elemento + ' option:first' ).val() );

      }

    },

    obitos : {

      criar : function( el ) {

        rotulo = document.createElement( 'label' );
        rotulo.appendChild( document.createTextNode( 'Óbitos' ) );
        rotulo.htmlFor = 'obitos';

        seletor = document.createElement( 'input' );
        seletor.type = 'checkbox';
        seletor.id = 'obitos';
        
        $( el ).append( rotulo ).append( seletor );

      }

    },

    criar : function( ) {

      el = this.elemento;

      this.semana.criar( el );
      this.obitos.criar( el );

    }

  },

  ultimo : function( data ) {

    if ( data == 'semana' ) return vis.dados.semanas[ 0 ].numero;
    if ( data == 'ano'    ) return vis.dados.semanas[ 0 ].ano;

  },

  UF : function( n, retorno ) {

    id = n.toString().substring( 0, 2 );

    UFs = vis.dados.UFs;

    for ( var i = 0, leni = UFs.length; i < leni; i++ ) {

      UF = UFs[ i ];

      if ( UF.id == id ) {

        return UF[ retorno ];

      }

    }

  },

  iniciou : false,

  iniciar : function() {

    for ( var i = 0; i < this.dependencias.length; i ++ ) {

      var dependencia = this.dependencias[ i ];

      this.carrega[ dependencia.tipo ]( dependencia.url );

    }

  }

};

vis.iniciar();
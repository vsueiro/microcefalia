var vis = {

  dados : {},

  carrega : {

    script : function( url ) {

      script = document.createElement( 'script' );
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

    local : 'todos',

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

    estado : {

      iniciado : false

    }

  },

  mapa : {

    elemento : '#mapa',

    zoom : 5,

    centro : {

      'lat' : -15.474053,
      'lng' : -53.290964

    },

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

            vis.atual.local = this.indice;

            vis.fichas.atualizar();

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
        vis.mapa.circulos.atualizar();
        vis.graficos.linhas.criar();

        vis.atual.estado.iniciado = true;
        
      },

      atualizar : function( sem, cat ) {

        sem = sem || vis.atual.semana();
        cat = cat || vis.atual.categoria();

        circulos = vis.mapa.circulos.lista;

        for ( var i = 0, leni = circulos.length; i < leni; i++ ) { // para cada círculo no mapa

          circulo = circulos[ i ];
          municipio = municipios[ i ];
          consta = false;

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) { // para cada caso do respectivo município

            caso = municipio.casos[ j ];

            if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

              if ( circulo == vis.mapa.circulos.selecionado ) {

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

    centralizar : function ( index ) {

      index = index || vis.atual.local;

      if ( index != 'todos' ) {

        position = vis.mapa.circulos.lista[ index ].position;
        zoom = 9;

      } else {

        position = vis.mapa.centro;
        zoom = vis.mapa.zoom;

      }

      vis.mapa.objeto.setZoom( zoom );
      vis.mapa.objeto.panTo( position );

    },

    criar : function() {

      this.objeto = new google.maps.Map( $( this.elemento )[ 0 ], {

        zoom: this.zoom,
        minZoom: 5,
        maxZoom: 12,
        center: this.centro,    
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

    linhas :  {

      elemento : '#linhas',

      calcular : function( quanto, tipo ) {

        municipios = vis.dados.municipios;

        return Math[ quanto ].apply( Math, municipios.map( function( municipio ) {

          return Math[ quanto ].apply( Math, municipio.casos.map( function( caso ) {

            return caso[ tipo ] ? caso[ tipo ] : 0;

          }));

        }));

      },

      categoria : {},

      semana : {},

      escala : {

        x : 20,
        y : 4

      },

      linha : {

        espessura : 2,
        cor : '#000'

      },

      baixar : function( arquivo ) {

        elemento = this.elemento.replace( '#', '' );

        svg = document.getElementById( elemento ).innerHTML,

        blob = new Blob( [ svg ], { 'type' : 'image/svg+xml' } ),

        a = document.createElement( 'a' );

        a.download = arquivo + '.svg';

        a.type = 'image/svg+xml';

        a.href = ( window.URL || webkitURL ).createObjectURL( blob );

        a.click();

      },

      criar : function( cat ) {

        cat = cat || 'tc';

        this.categoria.max = this.calcular( 'max', cat   );
        this.categoria.min = this.calcular( 'min', cat   );
        this.semana.max    = this.calcular( 'max', 'sem' );
        this.semana.min    = this.calcular( 'min', 'sem' );

        svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'version', '1.1' );
        svg.setAttribute( 'id', 'grafico-linhas' );
        svg.setAttribute( 'x', '0' );
        svg.setAttribute( 'y', '0' );
        svg.setAttribute( 'width', ( ( this.semana.max - this.semana.min ) * this.escala.x ) + ( this.escala.x * 2 ) );
        svg.setAttribute( 'height', ( this.categoria.max * this.escala.y ) + ( this.escala.y * 2) );
        svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' ); // http://www.w3.org/2000/xmlns/

        linhas = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
        linhas.setAttribute( 'id', 'linhas' );

        municipios = vis.dados.municipios;

        for ( var i = 0; i < municipios.length; i++ ) {

          municipio = municipios[ i ];

          grupo = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
          grupo.setAttribute( 'id', municipio.nome );

          for ( var j = 0; j < ( municipio.casos.length - 1 ); j++ ) {

            caso = municipio.casos[ j ];

            temCasos = false;

            if ( caso[ cat ] ) {

              opacidade = ( 1 / this.categoria.max * caso[ cat ] );

              linha = document.createElementNS( 'http://www.w3.org/2000/svg', 'line' );
              linha.setAttribute( 'fill', 'none' );
              linha.setAttribute( 'stroke', this.linha.cor );
              linha.setAttribute( 'stroke-width', this.linha.espessura );
              linha.setAttribute( 'stroke-linecap', 'round' );
              linha.setAttribute( 'stroke-linejoin', 'round' );
              linha.setAttribute( 'opacity', opacidade );
              linha.setAttribute( 'x1', ( ( caso.sem - ( this.semana.min - 1 ) ) * this.escala.x ) );
              linha.setAttribute( 'x2', ( ( municipio.casos[ j + 1 ].sem - ( this.semana.min - 1 ) ) * this.escala.x ) );
              linha.setAttribute( 'y1', ( ( ( this.categoria.max + 1 ) - caso[ cat ] ) * this.escala.y )  );
              linha.setAttribute( 'y2', ( municipio.casos[ j + 1 ][ cat ] ? ( ( ( this.categoria.max + 1 ) - municipio.casos[ j + 1 ][ cat ] ) * this.escala.y ) : ( ( ( this.categoria.max + 1 ) - caso[ cat ] ) * this.escala.y ) ) );
                  
              grupo.appendChild( linha );

              temCasos = true;

            }

            if ( temCasos ) {

              linhas.appendChild( grupo );

            }

          }

        }

        svg.appendChild( linhas );
        document.getElementById( 'linhas' ).appendChild( svg );

      }

    },

    evolucao : {

      elemento : 'evolucao',

      criar: function() {

        ol = document.createElement( 'ol' );
        ol.className = this.elemento;

        semanas = vis.dados.semanas;

        semanas.reverse();

        for ( var i = 0, leni = semanas.length; i < leni; i++ ) { // para cada semana epidemiológica do Brasil

          semana          = semanas[ i ];
          numero          = semana.numero;
          ano             = semana.ano;
          span            = {};
          li              = document.createElement( 'li' );
          div             = document.createElement( 'div' );
          span.quantidade = document.createElement( 'span' );
          span.semana     = document.createElement( 'span' );

          span.quantidade.innerHTML = 0;
          span.quantidade.className = 'casos';

          span.semana.innerHTML = 'Semana ' + numero + '/' + ano;
          span.semana.className = 'semana';

          div.className = 'barra';

          li.appendChild( span.quantidade );
          li.appendChild( div );
          li.appendChild( span.semana );
          li.dataset.sem = numero;
          li.dataset.ano = ano;

          ol.appendChild( li );

        }

        return ol;

      },

      atualizar : function( local ) {

        tipo = vis.atual.categoria();

        if ( local == 'todos' ) {

          semanas = vis.dados.totais;

        } else {

          function unicos( semanas ) {

            unicos = [];

            for ( var i = 0, leni = semanas.length; i < leni; i++ ) {

              semana = semanas[ i ];

              anterior = 0;

              unicos[ i ] = {

                ano: semana.ano,
                sem: semana.sem

              };

              if ( i > 0 && semanas[ i - 1 ][ tipo ] ) {

                anterior = semanas[ i - 1 ][ tipo ];

              }

              unicos[ i ][ tipo ] = semana[ tipo ] - anterior;

            }

            return unicos;

          }

          municipio = vis.dados.municipios[ local ];

          semanas = unicos( municipio.casos );

        }

        $( '.' + this.elemento ).find( 'li' ).each( function() {

          li  = $( this );
          sem = li.data( 'sem' );
          ano = li.data( 'ano' );
          consta = false;

          if ( sem <= vis.atual.semana().numero && ano <= vis.atual.semana().ano ) {

            console.log( 'ta ativo' );

            li.addClass( 'ativo' );

          } else {

            console.log( 'nao ta ativo' );

            li.removeClass( 'ativo' );

          }

          for ( var i = 0, leni = semanas.length; i < leni; i++ ) {

            semana = semanas[ i ];

            if ( semana.sem == sem && semana.ano == ano ) {

              casos = local == 'todos' ? semana.casos.unicos[ tipo ] : semana[ tipo ];
              altura = casos;

              if ( casos < 0 ) {

                li.addClass( 'negativo' );

                altura = Math.abs( casos );

              } else {

                li.removeClass( 'negativo' );

              }

              altura = altura + 'px';

              li.find( '.casos' ).text( casos );
              li.find( '.barra' ).css( 'height', altura );

              consta = true;

              break

            }

          }

          if ( !consta ) {

            li.find( '.casos' ).text( 'Sem dados' );
            li.find( '.barra' ).css( 'height', '0' );

          }

        });

      }

    }

  },

  fichas : {

    elemento : '.fichas',

    ativo : false,

    items : {

      local : {

        elemento : 'local',

        criar : function() {
            
          return 'Local: <span></span>';

        },

        atualizar : function( local ) {

          if ( local == 'todos' ) {

            conteudo = 'Brasil';

          } else {

            municipio = vis.dados.municipios[ local ];
            conteudo = municipio.nome;

          }

          ficha = vis.fichas.elemento;
          item = ' [data-item="' + this.elemento + '"]';

          $( ficha + item ).find( 'span' ).text( conteudo );

        }

      },

      UF : {

        elemento : 'UF',

        criar : function() {

          return 'UF: <span></span>';

        },

        atualizar : function( local ) {

          if ( local == 'todos' ) {

            conteudo = '–';

          } else {

            municipio = vis.dados.municipios[ local ];
            conteudo = vis.UF( municipio.id, 'nome' )

          }

          ficha = vis.fichas.elemento;
          item = ' [data-item="' + this.elemento + '"]';

          $( ficha + item ).find( 'span' ).text( conteudo );

        }

      },

      data : {

        elemento : 'data',

        criar : function() {

          return 'Até: <span></span>';

        },

        atualizar : function( local ) {

          sem = vis.atual.semana();

          ficha = vis.fichas.elemento;

          item = ' [data-item="' + this.elemento + '"]';

          for ( var i = 0, leni = vis.dados.semanas.length; i < leni; i++ ) {

            semana = vis.dados.semanas[ i ];

            if ( semana.numero == sem.numero && semana.ano == sem.ano ) {

              conteudo = vis.filtros.semana.quando( semana.fim );

              $( ficha + item ).find( 'span' ).text( conteudo );

              break;

            }

          }

        }

      },

      casos : {

        elemento : 'casos',

        criar : function() {

          categorias = vis.dados.categorias;

          ol = document.createElement( 'ol' );

          for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

            categoria = categorias[ i ];

            if ( categoria.visivel ) {

              li = document.createElement( 'li' );
              li.dataset.tipo = categoria.apelido;
              li.innerHTML = categoria.nome + ': <span></span>';

              ol.appendChild( li );

            }

          }

          return ol;

        },

        atualizar : function( local ) {

          sem = vis.atual.semana();

          ficha = vis.fichas.elemento;
          
          item = ' [data-item="' + this.elemento + '"]';

          if ( local == 'todos' ) {

            totais = vis.dados.totais;

            for ( var i = 0, leni = totais.length; i < leni; i++ ) {

              total = totais[ i ];

              if ( total.ano == sem.ano && total.sem == sem.numero ) {

                $( ficha + item ).find( 'li' ).each( function() {

                  tipo = $( this ).data( 'tipo' );

                  conteudo = total.casos.acumulados[ tipo ] || 0;

                  $( this ).find( 'span' ).text( conteudo );

                });

                break

              }

            }         

          } else {

            municipio = vis.dados.municipios[ local ];

            for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) {

              caso = municipio.casos[ i ];

              if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

                $( ficha + item ).find( 'li' ).each( function() {

                  tipo = $( this ).data( 'tipo' );

                  conteudo = caso[ tipo ] || 0;

                  $( this ).find( 'span' ).text( conteudo );

                });

                break

              }

            }

          }

        }

      },

      grafico : {

        elemento : 'grafico',

        criar : function() {

          return vis.graficos.evolucao.criar();

        },

        atualizar : function( local ) {

          return vis.graficos.evolucao.atualizar( local );

        }
        
      }

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

    criar : function( local ) {

      local = local || 'todos';

      this.totais();

      ul = document.createElement( 'ul' );

      for ( nome in this.items ) {

        conteudo = this.items[ nome ].criar( local );

        li = document.createElement( 'li' );
        li.dataset.item = this.items[ nome ].elemento;

        if ( typeof conteudo === 'object' ) {

          li.appendChild( conteudo );
            
        } else {

          li.innerHTML = conteudo;

        }
        
        ul.appendChild( li );

      }

      $( this.elemento ).append( ul );

      this.atualizar( local )

    },

    atualizar : function( local ) {

      local = local || vis.atual.local;

      for ( nome in this.items ) {

        conteudo = this.items[ nome ].atualizar( local );

      }

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

      seletor : {

        elemento : '.semanas',

        criar : function( el ) { 

          function removeAno( str ) {

            return str.replace( /\sde\s+\d{4}/gi ,'' );

          }

          function removeMesDuplicado( str ) {

            mes = str.match( /\sde\s+(\w|ç)+/gi );

            if ( mes[ 0 ] == mes[ 1 ] ) {

              return str.replace( /\sde\s+(\w|ç)+/i , '' );

            } else {

              return str
            }

          }

          seletor = document.createElement( 'select' );
          seletor.className = 'semanas';

          grupos = {};

          vis.dados.semanas.forEach( function( semana ) {

            ano = semana.ano;
            inicio = vis.filtros.semana.quando( semana.inicio );
            fim = vis.filtros.semana.quando( semana.fim );

            acumulados = 'Até ' + fim;
            acumulados = removeAno( acumulados );

            unicos = inicio + ' a ' + fim;
            unicos = removeAno( unicos );
            unicos = removeMesDuplicado( unicos );

            opcao = document.createElement( 'option' );
            opcao.value = semana.numero + '/' + ano;
            opcao.dataset.unicos = unicos;
            opcao.text = acumulados;

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

          vis.filtros.semana.deslizador.criar( el );

        }

      },

      deslizador : {

        elemento : 'deslizador',

        criar: function( el ) {

          div = document.createElement( 'div' );
          div.id = this.elemento;
          div.className = 'dragdealer';

          handle = document.createElement( 'div' );
          handle.className = 'handle';

          div.appendChild( handle );

          $( el ).append( div );

          this.objeto = new Dragdealer( this.elemento, {

            steps: vis.dados.semanas.length,
            slide: false,
            snap: true,
            x: 1,
            animationCallback: function( x, y ) {

              i = this.getStep()[ 0 ];

              seletor = $( vis.filtros.semana.elemento );

              seletor.val( $( vis.filtros.semana.elemento + ' option' ).eq( vis.dados.semanas.length - i ).val() );

              if ( vis.atual.estado.iniciado ) {

                vis.fichas.atualizar();

              }

              $( '#' + this.wrapper.id ).addClass( 'loaded' ).find( '.handle' ).text( seletor.val() );

            },
            callback: function( x, y ) {

              vis.mapa.circulos.atualizar();

              vis.fichas.atualizar();

              $( '#' + this.wrapper.id ).find( '.handle' ).text( seletor.val() );

            }

          });

        } 

      },

      criar : function( el ) {

        this.seletor.criar( el );

      }

    },

    municipio : {

      elemento : 'municipio',

      busca : {

        criar : function( el ) {

          campo = document.createElement( 'input' );
          campo.type = 'search';
          campo.name = this.elemento;
          campo.placeholder = 'Buscar município';

          $( el ).append( campo );

        }

      },

      seletor : {

        criar : function( el ) {

          seletor = document.createElement( 'select' );
          seletor.className = 'municipios';
    
          opcao = document.createElement( 'option' );
          opcao.selected = true;
          opcao.value = 'todos';
          opcao.text = 'Todos os municípios';

          seletor.appendChild( opcao );

          municipios = vis.dados.municipios;

          for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

            municipio = municipios[ i ];

            opcao = document.createElement( 'option' );
            opcao.value = i;
            opcao.text = municipio.nome;

            seletor.appendChild( opcao );

          }    

          $( el ).append( seletor );

        }

      },

      criar : function( el ) {

        this.busca.criar( el );
        this.seletor.criar( el );

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
      this.municipio.criar( el );
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

  eventos : function() {

    $( document ).on( 'change', '.semanas', function() {

      index = $( '.semanas option:selected' ).index();

      step = vis.dados.semanas.length - index;

      vis.mapa.circulos.atualizar();

      vis.fichas.atualizar();

      vis.filtros.semana.deslizador.objeto.setStep( step, 0 );

    });

    $( document ).on( 'change', '.municipios', function() {

      index = $( '.municipios option:selected' ).val();

      // alert( index );

      vis.atual.local = index;

      vis.mapa.circulos.selecionado = vis.mapa.circulos.lista[ index ];

      if ( index != 'todos' ) {

        new google.maps.event.trigger( 

          vis.mapa.circulos.selecionado, 'click'

        );

      }

      vis.mapa.centralizar();

      vis.fichas.atualizar();

    });


  },

  iniciar : function() {

    for ( var i = 0; i < this.dependencias.length; i ++ ) {

      var dependencia = this.dependencias[ i ];

      this.carrega[ dependencia.tipo ]( dependencia.url );

    }

    this.eventos();

  }

};

vis.iniciar();
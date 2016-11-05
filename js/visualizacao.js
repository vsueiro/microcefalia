var vis = {

  elemento : 'visualizacao',

  dados : {

    ordenar : {

      desc : function( a, b ) {

        tipo = vis.atual.categoria;

        A = vis.obter.acumulados( a, tipo ) || 0;
        B = vis.obter.acumulados( b, tipo ) || 0;

        return B - A

      }
 
    },

  },

  carregar : {

    script : function( dependencia ) {

      script = document.createElement( 'script' );
      script.type = 'text/javascript';
      script.src = dependencia.url;
      document.body.appendChild( script );

    },

    json : function( dependencia ) {

      vis.dados.requisicoes.push(

        $.ajax({

          dataType : dependencia.tipo,
          url : dependencia.url,
          success: function() {


          }

        })

      );

    }

  },

  obter : {

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

          return UF[ retorno ]

        }

      }

    },

    semana : function() {

      classe = vis.filtros.semana.elemento;

      elementos = document.getElementsByClassName( classe );

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];
        
        return elemento.value

      }

      return undefined

    },

    municipio : function( id ) {

      municipios = vis.dados.municipios;

      for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

        municipio = municipios[ i ];

        if ( municipio.id == id ) {

          return municipio

        }

      }

    },

    acumulados : function( municipio, tipo ) {

      i = municipio.casos.length;

      semana = vis.atual.semana();

      while ( i-- ) {

        caso = municipio.casos[ i ];

        if ( caso.ano <= semana.ano && caso.sem <= semana.numero ) { // pega o ultimo dado da categoria que consta, mesmo que não seja na semana mais recente

          if ( tipo in caso ) {

            return caso[ tipo ]

          }

        }

      } 

    },

    totais : function( local ) {

      if ( local == 'todos' ) {

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

              totais[ i ].casos.acumulados[ categoria.sigla ] = 0; 

              municipios = vis.dados.municipios;

              for ( var k = 0, lenk = municipios.length; k < lenk; k++ ) {

                municipio = municipios[ k ];

                for ( var l = 0, lenl = municipio.casos.length; l < lenl; l++ ) {

                  caso = municipio.casos[ l ];

                  if ( caso.ano == semana.ano && caso.sem == semana.numero ) {

                    if ( categoria.sigla in caso ) {

                      totais[ i ][ 'casos' ][ 'acumulados' ][ categoria.sigla ] += caso[ categoria.sigla ];

                    }

                    break

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

      }

      else if ( local == 'UF' ) {

        municipios  = vis.dados.municipios;
        categorias  = vis.dados.categorias;
        semanas     = vis.dados.semanas;
        UFs         = vis.dados.UFs;

        for ( var i = 0, leni = UFs.length; i < leni; i++ ) { // cria os objetos zerados para cada semana

          UF = UFs[ i ];

          UF.casos = [];
          
          for ( var j = 0, lenj = semanas.length; j < lenj; j++ ) {

            semana = semanas[ j ];

            caso = {

              ano : semana.ano,
              sem : semana.numero,

            };

            for ( var k = 0, lenk = categorias.length; k < lenk; k++ ) {

              categoria = categorias[ k ];

              tipo = categoria.sigla;

              if ( categoria.visivel ) {

                caso[ tipo ] = 0;

              }

            }

            UF.casos.push( caso );
            
          }

        }

        for ( var i = 0, leni = municipios.length; i < leni; i++ ) { // soma cada tipo de caso, para cada semana

          municipio = municipios[ i ];

          atual = vis.obter.UF( municipio.id, 'id' );

          for ( var j = 0, lenj = UFs.length; j < lenj; j++ ) {

            UF = UFs[ j ];

            if ( UF.id == atual ) {

              casos = UF.casos;

              for ( var k = 0, lenk = casos.length; k < lenk; k++ ) {

                caso = casos[ k ];

                for ( var l = 0, lenl = municipio.casos.length; l < lenl; l++ ) { 

                  casoAtual = municipio.casos[ l ];

                  if ( casoAtual.ano == caso.ano && casoAtual.sem == caso.sem ) {

                    for ( var m = 0, lenm = categorias.length; m < lenm; m++ ) {

                      categoria = categorias[ m ];

                      if ( categoria.visivel ) {

                        tipo = categoria.sigla;

                        quantidade = 0;

                        if ( casoAtual[ tipo ] !== undefined ) {

                          quantidade = casoAtual[ tipo ];

                        }

                        caso[ tipo ] += quantidade;

                      }

                    }

                  }

                }

              }

              break

            }

          }

        }

      }

    },

    incidencia : {

      base : 100000,

      classificacao : [],

      criar : function() {

        tipo = vis.atual.categoria;

        municipios = vis.dados.municipios;

        for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

          municipio = municipios[ i ];

          casos = vis.obter.acumulados( municipio, tipo ) || 0;

          populacao = municipio.pop;

          base = this.base;

          incidencia = base * casos / populacao;

          this.classificacao[ i ] = {

            incidencia : incidencia,
            municipio : municipio.nome

          }

        }

        this.classificacao.sort( function( a, b ) {

          return b.incidencia - a.incidencia

        } );

        // console.log( this.classificacao );

      }

    },

    csv : {

      baixar : function( conteudo, arquivo ) {

        blob = new Blob( [ conteudo ], { 'type' : 'text/csv' } ),

        a = document.createElement( 'a' );

        a.download = arquivo + '.csv';

        a.type = 'image/svg+xml';

        a.href = ( window.URL || webkitURL ).createObjectURL( blob );

        a.click();

      },

      municipios : function( tipo ) {

        tipo = tipo || 'c';

        municipios = vis.dados.municipios;

        semanas = vis.dados.semanas;

        csv = 'até';

        for ( var i = 0; i < 10; i++ ) { // monta cabeçalho

          municipio = municipios[ i ];

          csv += ',' + municipio.nome;

          if ( i == 9 ) {

            csv += '\n';

          }

        }

        for ( var j = 0, lenj = semanas.length; j < lenj; j++ ) { // adiciona conteúdo

          semana = semanas[ j ];

          csv += semana.inicio;

          for ( var i = 0; i < 10; i++ ) {

            municipio = municipios[ i ];

            for ( var k = 0, lenk = municipio.casos.length; k < lenk; k++ ) {

              caso = municipio.casos[ k ];

              if ( semana.ano == caso.ano && semana.numero == caso.sem ) {

                csv += ',' + caso[ tipo ];

              }

            }

            if ( i == 9 ) {

              csv += '\n';

            }

          }

        }

        // console.log( csv );

        this.baixar( csv, 'Acumulado de casos confirmados por semana dos 10 municípios mais afetados.csv' );

      },

      UFs : function() {

        tipo = tipo || 'c';

        UFs = vis.dados.UFs;

        semanas = vis.dados.semanas;

        csv = 'até';

        for ( var i = 0, leni = UFs.length; i < leni; i++ ) { // monta cabeçalho

          UF = UFs[ i ];

          csv += ',' + UF.sigla;

          if ( i == leni - 1 ) {

            csv += '\n';

          }

        }

        for ( var j = 0, lenj = semanas.length; j < lenj; j++ ) { // adiciona conteúdo

          semana = semanas[ j ];

          csv += semana.inicio;

          for ( var i = 0, leni = UFs.length; i < leni; i++ ) { // monta cabeçalho

            UF = UFs[ i ];

            for ( var k = 0, lenk = UF.casos.length; k < lenk; k++ ) {

              caso = UF.casos[ k ];

              if ( semana.ano == caso.ano && semana.numero == caso.sem ) {

                csv += ',' + caso[ tipo ];

              }

            }

            if ( i == leni - 1 ) {

              csv += '\n';

            }

          }

        }

        // console.log( csv );

        this.baixar( csv, 'Acumulado de casos confirmados por semana de todas as UFs.csv' );

      }

    }

  },

  dependencias : [

    { 
      nome : 'semanas',
      tipo : 'json', 
      url : 'data/semanas.json'
    },
    {
      nome : 'UFs',
      tipo : 'json', 
      url : 'data/UFs.json'
    },
    {
      nome : 'categorias',
      tipo : 'json', 
      url : 'data/categorias.json'
    },
    {
      nome : 'municipios',
      tipo : 'json', 
      url : 'data/microcefalia-42-2016.json' // 'data/microcefalia-42-2016-c-i-o-oi.json'
    },
    {
      nome : 'Google Maps',
      tipo : 'script',      
      url : '//maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs&callback=vis.mapa.criar'
    }

  ],

  sobre : {

    titulo : 'Microcefalia em recém-nascidos no Brasil',
    descricao : 'O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central desde 15 de novembro de 2015, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos',

  },

  atual : {

    UF : 'todos',

    local : 'todos',

    semana : function() {

      if ( vis.obter.semana() ) {

        semana = vis.obter.semana();

      } else {

        semana = vis.dados.semanas[ 0 ].numero + '/' + vis.dados.semanas[ 0 ].ano; // padrão: semana mais recente
        
      }

      semana = semana.split( '/' );

      return {
        'numero' : parseInt( semana[ 0 ] ),
        'ano'    : parseInt( semana[ 1 ] )
      }

    },

    categoria : undefined,

    estado : {

      iniciado : false

    }

  },

  mapa : {

    elemento : 'mapa',

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
        selecionado : '#000',
        obito: '#41d893'

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
            zIndex : i,
            icon: {

              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
              fillColor: vis.mapa.circulos.cor.normal,
              fillOpacity: 0.5,
              strokeColor: vis.mapa.circulos.cor.normal,
              strokeWeight: 0

            }

          });

          circulo.addListener( 'click', function() {

            if ( vis.atual.local == this.id ) {

              vis.atual.local = 'todos';

            } else {

              vis.atual.local = this.id;

            }

            vis.atualizar();
            
          });

          circulo.addListener( 'mouseover', function() {

            if ( this.id != vis.atual.local ) {

              this.getIcon().strokeWeight = 1;

              this.setIcon( this.getIcon() );

            }

          });

          circulo.addListener( 'mouseout', function() {

            if ( this.id != vis.atual.local ) {

              this.getIcon().strokeWeight = 0;
            
              this.setIcon( this.getIcon() );

            }

          });

          vis.mapa.circulos.lista.push( circulo );

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) {

            caso = municipio.casos[ j ];

            if ( caso.sem == vis.obter.ultimo( 'semana' ) ) { // semana mais recente no geral

              for ( var k = 0, lenk = vis.dados.categorias.length; k < lenk; k++ ) {

                categoria = vis.dados.categorias[ k ];

                if ( categoria.visivel && caso[ categoria.sigla ] ) { // se este municipio tem dados sobre esta categoria em sua semana mais recente

                  categoria.total += caso[ categoria.sigla ];

                }

              }

            }
            
          }

        }

        vis.filtros.criar();
        vis.fichas.criar();
        vis.classificacao.criar();
        vis.mapa.circulos.atualizar();
        vis.graficos.linhas.criar( 'municipios' );
        vis.graficos.linhas.criar( 'UFs' );

        vis.atual.estado.iniciado = true;
        
      },

      atualizar : function( sem, cat ) {

        sem = sem || vis.atual.semana();
        cat = cat || vis.atual.categoria;

        id = vis.atual.local;

        circulos = vis.mapa.circulos.lista;

        for ( var i = 0, leni = circulos.length; i < leni; i++ ) { // para cada círculo no mapa

          circulo = circulos[ i ];
          municipio = municipios[ i ];
          consta = false;

          for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) { // para cada caso do respectivo município

            caso = municipio.casos[ j ];

            if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

              raio = Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * vis.mapa.circulos.amplitude;
              
              circulo.getIcon().scale = raio;
              circulo.getIcon().strokeWeight = 0;
      
              circulo.setIcon( circulo.getIcon() );

              consta = true;

              break

            }

          }

          if ( !consta ) { // se não há informação, zera o círculo

            circulo.getIcon().scale = 0;
      
            circulo.setIcon( circulo.getIcon() );

          }

          if ( vis.atual.UF != 'todos' ) {

            if ( vis.atual.UF == vis.obter.UF( circulo.id, 'id' ) && vis.atual.local == 'todos' ) {

              circulo.getIcon().fillOpacity = .9;

              circulo.setIcon( circulo.getIcon() );

            } else {

              circulo.getIcon().fillOpacity = .1;

              circulo.setIcon( circulo.getIcon() );

            }

          } else {

            circulo.getIcon().fillOpacity = .5;

            circulo.setIcon( circulo.getIcon() );

          }

          if ( vis.atual.local == circulo.id ) {

            circulo.getIcon().strokeWeight = 2;

            circulo.setIcon( circulo.getIcon() );

          }

        }

        // if ( indice != 'todos' ) {

        //   circulos[ indice ].getIcon().strokeWeight = 2;

        //   circulos[ indice ].setIcon( circulos[ indice ].getIcon() );

        // }

      }

    },

    centralizar : function ( id ) {

      id = id || vis.atual.local;

      if ( id != 'todos' ) {

        // position = vis.mapa.circulos.lista[ index ].position; substituir por um loop que busca o círculo com id igual a id
        zoom = 9;

      } else {

        position = vis.mapa.centro;
        zoom = vis.mapa.zoom;

      }

      vis.mapa.objeto.setZoom( zoom );
      vis.mapa.objeto.panTo( position );

    },

    criar : function() {
      
      elementos = document.getElementsByClassName( this.elemento );

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];

        this.objeto = new google.maps.Map( elemento, {

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
        
        callback = setInterval( function(){

          if ( !( 'requisicoes' in vis.dados ) ) {
            
            vis.dados.municipios.sort( vis.dados.ordenar.desc );

            vis.mapa.circulos.criar();

            clearInterval( callback );

          }

        }, 25 );

      }
      
      
      /*
      // temp

      vis.filtros.criar();
      vis.classificacao.criar();
      vis.graficos.linhas.criar( 'municipios' );
      vis.graficos.linhas.criar( 'UFs' );

      vis.atual.estado.iniciado = true;

      */      

    } 

  },

  graficos : {

    linhas : {

      elemento : 'acumulado',

      calcular : function( quanto, tipo, entidade ) {

        locais = vis.dados[ entidade ];

        return Math[ quanto ].apply( Math, locais.map( function( local ) {

          return Math[ quanto ].apply( Math, local.casos.map( function( caso ) {

            return caso[ tipo ] ? caso[ tipo ] : 0;

          }));

        }));

      },

      categoria : {},

      semana : {},

      escala : {

        x : 20,
        y : 2

      },

      linha : {

        espessura : 2,
        cor : '#000'

      },

      baixar : function( arquivo ) {

        elemento = this.elemento;

        svg = document.getElementById( elemento ).innerHTML,

        blob = new Blob( [ svg ], { 'type' : 'image/svg+xml' } ),

        a = document.createElement( 'a' );

        a.download = arquivo + '.svg';

        a.type = 'image/svg+xml';

        a.href = ( window.URL || webkitURL ).createObjectURL( blob );

        a.click();

      },

      criar : function( entidade ) {

        entidade = entidade || 'municipios';

        classe = this.elemento + ' ' + entidade;

        elementos = document.getElementsByClassName( classe );

        for ( var h = 0; h < elementos.length; h++ ) {

          elemento = elementos[ h ];

          cat = vis.atual.categoria;

          this.categoria.max = this.calcular( 'max', cat  , entidade );
          this.categoria.min = this.calcular( 'min', cat  , entidade );
          this.semana.max    = this.calcular( 'max', 'sem', entidade );
          this.semana.min    = this.calcular( 'min', 'sem', entidade );

          svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
          svg.setAttribute( 'version', '1.1' );
          svg.setAttribute( 'x', '0' );
          svg.setAttribute( 'y', '0' );
          svg.setAttribute( 'width', ( ( this.semana.max - this.semana.min ) * this.escala.x ) + ( this.escala.x * 2 ) );
          svg.setAttribute( 'height', ( this.categoria.max * this.escala.y ) + ( this.escala.y * 2) );
          svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' ); // http://www.w3.org/2000/xmlns/

          linhas = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
          linhas.classList.add( 'linhas' );

          locais = vis.dados[ entidade ];

          for ( var i = 0, leni = locais.length; i < leni; i++ ) {

            local = locais[ i ];

            grupo = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
            grupo.setAttribute( 'id', 'local-' + local.id + '-' + h );
            grupo.setAttribute( 'opacity', 1 );
            // console.log( local );
            grupo.setAttribute( 'nome', local.nome );
            grupo.addEventListener( 'click', function() {

              alert( this.getAttribute( 'nome' ) );
              
            });

            for ( var j = 0; j < ( local.casos.length - 1 ); j++ ) {

              caso = local.casos[ j ];

              temCasos = false;

              if ( caso[ cat ] ) {

                opacidade = ( 1 / this.categoria.max * caso[ cat ] );
                opacidade = .1;

                linha = document.createElementNS( 'http://www.w3.org/2000/svg', 'line' );
                linha.setAttribute( 'fill', 'none' );
                linha.setAttribute( 'stroke', this.linha.cor );
                linha.setAttribute( 'stroke-width', this.linha.espessura );
                linha.setAttribute( 'stroke-linecap', 'round' );
                linha.setAttribute( 'stroke-linejoin', 'round' );
                linha.setAttribute( 'opacity', opacidade );
                linha.setAttribute( 'x1', ( ( caso.sem - ( this.semana.min - 1 ) ) * this.escala.x ) );
                linha.setAttribute( 'x2', ( ( local.casos[ j + 1 ].sem - ( this.semana.min - 1 ) ) * this.escala.x ) );
                linha.setAttribute( 'y1', ( ( ( this.categoria.max + 1 ) - caso[ cat ] ) * this.escala.y )  );
                linha.setAttribute( 'y2', ( local.casos[ j + 1 ][ cat ] ? ( ( ( this.categoria.max + 1 ) - local.casos[ j + 1 ][ cat ] ) * this.escala.y ) : ( ( ( this.categoria.max + 1 ) - caso[ cat ] ) * this.escala.y ) ) );
                    
                grupo.appendChild( linha );

                temCasos = true;

              }

              if ( temCasos ) {

                linhas.appendChild( grupo );

              }

            }

            if ( i == ( leni - 1 ) ) {

              use = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' );
              use.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#local-' + local.id + '-' + h );

            }

          }

          svg.appendChild( linhas );
          svg.appendChild( use );

          elemento.appendChild( svg );

        }

      },

      atualizar : function( entidade ) {

        entidade = entidade || 'municipios';

        classe = this.elemento + ' ' + entidade;

        elementos = document.getElementsByClassName( classe );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          involucros = elemento.getElementsByClassName( 'linhas' );

          atual = 'local-' + vis.atual.local + '-' + i;

          use = document.getElementsByTagName( 'use' )[ 0 ];
          use.href.baseVal = '#' + atual ;

          for ( var j = 0, lenj = involucros.length; j < lenj; j++ ) {

            involucro = involucros[ j ];

            grupos = involucro.getElementsByTagName( 'g' );

            for ( var k = 0, lenk = grupos.length; k < lenk; k++ ) {

              grupo = grupos[ k ];

              if ( vis.atual.local == 'todos' ) {

                linhas = grupo.getElementsByTagName( 'line' );

                for ( var l = 0, lenl = linhas.length; l < lenl; l++ ) {

                  linha = linhas[ l ];

                  linha.setAttribute( 'stroke', '#000' );
                  linha.setAttribute( 'opacity', .1 );

                }

              } else {

                if ( atual == grupo.id ) { // se for municipio selecionado

                  linhas = grupo.getElementsByTagName( 'line' );

                  for ( var l = 0, lenl = linhas.length; l < lenl; l++ ) {

                    linha = linhas[ l ];

                    linha.setAttribute( 'stroke', '#000' );
                    linha.setAttribute( 'opacity', 1 );

                  }

                } else {

                  linhas = grupo.getElementsByTagName( 'line' );

                  for ( var l = 0, lenl = linhas.length; l < lenl; l++ ) {

                    linha = linhas[ l ];

                    linha.setAttribute( 'stroke', '#ccc' );
                    linha.setAttribute( 'opacity', 0.1 );

                  }

                }

              }

            }

          }

        }

      }

    },

    evolucao : {

      elemento : 'evolucao',

      estilo : {

        tamanho : 'pequeno',
        x : 4 // 8

      },

      negativo : false,

      criar: function( local ) {

        local = local || 'todos';

        ol = document.createElement( 'ol' );
        ol.className = this.elemento;
        ol.dataset.local = local;

        semanas = vis.dados.semanas;

        semanas.sort( function( a, b ) {

          if ( a.inicio < b.inicio ) return -1;
          if ( a.inicio > b.inicio ) return 1;
          return 0;

        });

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

          span.semana.innerHTML = 'semana ' + numero + '/' + ano;
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

      atualizar : function( local, estilo ) {

        local = local || 'todos';

        estilo = estilo || this.estilo;

        tipo = vis.atual.categoria;

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

          semanas = unicos( vis.obter.municipio( local ).casos ); 

        }

        // console.log( 'atualiza ' + vis.obter.municipio( local ).nome );

        // console.log( semanas );

        elementos = document.getElementsByClassName( this.elemento );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          if ( elemento.dataset.local == local ) {

            if ( estilo.tamanho != '' ) {

              elemento.classList.add( estilo.tamanho );

            }

            lis = elemento.getElementsByTagName( 'li' );

            for ( var j = 0; j < lis.length; j++ ) {

              li = lis[ j ];

              sem = li.dataset.sem;
              ano = li.dataset.ano;
              consta = false;
              largura = estilo.x;

              li.style.width = largura + 'px';

              if ( sem <= vis.atual.semana().numero && ano <= vis.atual.semana().ano ) {

                li.classList.add( 'ativo' );

              } else {

                li.classList.remove( 'ativo' );

              }

              for ( var k = 0, lenk = semanas.length; k < lenk; k++ ) {

                semana = semanas[ k ];

                if ( semana.sem == sem && semana.ano == ano ) {

                  if ( local == 'todos' ) {

                    quantidade = semana.casos.unicos[ tipo ] || 0;

                  } else {

                    quantidade = semana[ tipo ] || 0;

                  }

                  altura = quantidade * 4;

                  if ( quantidade < 0 ) {

                    li.classList.add( 'negativo' );

                    if ( this.negativo ) {

                      altura = Math.abs( quantidade * 4 );

                    } else {

                      altura = 0;

                    }

                  } else {

                    li.classList.remove( 'negativo' );

                  }

                  casos = li.getElementsByClassName( 'casos' )[ 0 ];
                  casos.innerHTML = quantidade;

                  if ( sem == 6 && ano == 2016 ) { // faz quadrado do acumulado

                    lado = Math.sqrt( largura * altura );

                    li.style.width = lado + 'px';

                    li.classList.add( 'quadrado' );

                  } else {

                    altura += 'px';
                    largura += 'px';

                    barra = li.getElementsByClassName( 'barra' )[ 0 ];

                    // li.style.width = largura;

                    barra.style.height = altura;

                  }
                   
                  consta = true;

                  break

                }

              }

            }

            if ( !consta ) {

              casos = li.getElementsByClassName( 'casos' )[ 0 ];
              barra = li.getElementsByClassName( 'barra' )[ 0 ];

              casos.innerHTML = '';
              barra.style.height = 0;
              // li.find( '.barra' ).css( 'height', '0' );

            }

          }

        }

      }

    },

    circulo : {

      criar : function( local ) {

        circulos = document.createElement( 'div' );
        circulos.classList.add( 'circulos' );

        circulo = document.createElement( 'div' );
        circulo.classList.add( 'circulo' );
        circulo.dataset.local = local;

        circulos.appendChild( circulo );

        return circulos;

      },

      atualizar : function( local ) {

        cat = vis.atual.categoria;

        circulos = document.getElementsByClassName( 'circulo' );

        sem = vis.atual.semana();

        municipio = vis.obter.municipio( local );

        raio = 0;

        for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) { // para cada caso do respectivo município

          caso = municipio.casos[ i ];

          if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

            console.log(  '')

            raio = Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * vis.mapa.circulos.amplitude;

            break

          }

        }

        for ( var j = 0, lenj = circulos.length; j < lenj; j++ ) {

          circulo = circulos[ j ];

          if ( circulo.dataset.local == local ) {

            circulo.style.width  = raio * 2 + 'px';
            circulo.style.height = raio * 2 + 'px';

          }

        }

      }

    }

  },

  fichas : {

    elemento : 'fichas',

    itens : {

      casos : {

        elemento : 'casos',

        criar : function() {

          categorias = vis.dados.categorias;

          ol = document.createElement( 'ol' );

          for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

            categoria = categorias[ i ];

            if ( categoria.visivel ) {

              li = document.createElement( 'li' );
              li.dataset.tipo = categoria.sigla;
              li.innerHTML = categoria.apelido + ': <span></span>';

              ol.appendChild( li );

            }

          }

          return ol;

        },

        atualizar : function( id ) {

          sem = vis.atual.semana();

          // ficha = vis.fichas.elemento;
          
          // item = ' [data-item="' + this.elemento + '"]';

          if ( id == 'todos' ) {

            totais = vis.dados.totais;

            for ( var i = 0, leni = totais.length; i < leni; i++ ) {

              total = totais[ i ];

              if ( total.ano == sem.ano && total.sem == sem.numero ) {

                elementos = document.getElementsByClassName( vis.fichas.elemento );

                for ( var j = 0; j < elementos.length; j++ ) {

                  elemento = elementos[ j ];
          
                  item = elemento.querySelectorAll( '[data-item="' + this.elemento + '"]' )[ 0 ];            

                  lis = item.getElementsByTagName( 'li' );

                  for ( var k = 0; k < lis.length; k++ ) {

                    li = lis[ k ];

                    tipo = li.dataset.tipo;

                    conteudo = total.casos.acumulados[ tipo ] || 0;

                    span = li.getElementsByTagName( 'span' )[ 0 ];

                    span.innerHTML = conteudo;

                  }

                }

                break

              }

            }         

          } else {

            municipio = vis.obter.municipio( id );

            for ( var i = 0, leni = municipio.casos.length; i < leni; i++ ) {

              caso = municipio.casos[ i ];

              if ( caso.sem == sem.numero && caso.ano == sem.ano ) {

                elementos = document.getElementsByClassName( vis.fichas.elemento );

                for ( var j = 0; j < elementos.length; j++ ) {

                  elemento = elementos[ j ];
        
                  item = elemento.querySelectorAll( '[data-item="' + this.elemento + '"]' )[ 0 ];            

                  lis = item.getElementsByTagName( 'li' );

                  for ( var k = 0; k < lis.length; k++ ) {

                    li = lis[ k ];

                    tipo = li.dataset.tipo;

                    conteudo = caso[ tipo ] || 0;

                    span = li.getElementsByTagName( 'span' )[ 0 ];

                    span.innerHTML = conteudo;

                  }

                }

                break

              }

            }

          }

        }

      }

    },

    criar : function( local ) {
      
      local = local || 'todos';

      vis.obter.totais( 'todos' );
      vis.obter.totais( 'UF' );

      elementos = document.getElementsByClassName( this.elemento );

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];

        ul = document.createElement( 'ul' );

        for ( nome in this.itens ) {

          conteudo = this.itens[ nome ].criar( local );

          li = document.createElement( 'li' );
          li.dataset.item = this.itens[ nome ].elemento;

          if ( typeof conteudo === 'object' ) {

            li.appendChild( conteudo );
              
          } else {

            li.innerHTML = conteudo;

          }
          
          ul.appendChild( li );

        }

        elemento.appendChild( ul );

        this.atualizar( local )

      }
      
    },

    atualizar : function( local ) {
      
      local = local || vis.atual.local;

      for ( nome in this.itens ) {

        conteudo = this.itens[ nome ].atualizar( local );

      }
      

    }

  },

  filtros : {

    elemento : 'filtros',

    semana : {

      elemento : 'semanas',

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

        // elemento : '.semanas',

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

          elementos = document.getElementsByClassName( el );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];

            seletor = document.createElement( 'select' );
            seletor.className = 'semanas';

            grupos = {};

            vis.dados.semanas.forEach( function( semana, i ) {

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
              opcao.selected = i == 0 ? true : false;
              opcao.text = acumulados;
              opcao.dataset.unicos = unicos;

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

            elemento.appendChild( seletor );

            seletor.addEventListener( 'change', function() {

              step = vis.dados.semanas.length - this.selectedIndex;

              vis.filtros.semana.deslizador.objeto.setStep( step, 0 );

              vis.atualizar();

            });

            vis.filtros.semana.deslizador.criar( el );

          }

        }

      },

      deslizador : {

        elemento : 'deslizador',

        atualizou : false,

        temporizador : undefined,

        criar : function( el ) {

          elementos = document.getElementsByClassName( el );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];

            div = document.createElement( 'div' );
            div.id = this.elemento;
            div.className = 'dragdealer';

            handle = document.createElement( 'div' );
            handle.className = 'handle';

            div.appendChild( handle );

            elemento.appendChild( div );

            this.objeto = new Dragdealer( this.elemento, {

              steps : vis.dados.semanas.length,
              slide : false,
              snap : true,
              x : 1,

              animationCallback : function( x, y ) {

                vis.filtros.semana.deslizador.atualizou = false;

                if ( vis.filtros.semana.deslizador.temporizador ) {

                  clearTimeout( vis.filtros.semana.deslizador.temporizador );

                }

                i = parseInt( this.getStep()[ 0 ] );

                classe = vis.filtros.semana.elemento;

                seletores = document.getElementsByClassName( classe );

                for ( var j = 0; j < seletores.length; j++ ) {

                  seletor = seletores[ j ];

                  seletor.selectedIndex = vis.dados.semanas.length - i;

                }

                if ( vis.atual.estado.iniciado ) {

                  vis.classificacao.atualizar();

                  vis.fichas.atualizar();

                }

                pai = document.getElementById( this.wrapper.id );

                pai.classList.add( 'carregado' );

                pai.getElementsByClassName( 'handle' )[ 0 ].innerHTML = vis.obter.semana();

                vis.filtros.semana.deslizador.temporizador = setTimeout( function(){

                  if ( !vis.filtros.semana.deslizador.atualizou ) {

                    vis.mapa.circulos.atualizar();

                    vis.fichas.atualizar();

                    vis.filtros.semana.deslizador.atualizou = true;

                  }

                }, 500);

              },

              callback : function( x, y ) {

                if ( !vis.filtros.semana.deslizador.atualizou ) {

                  vis.mapa.circulos.atualizar();

                  vis.fichas.atualizar();

                  vis.filtros.semana.deslizador.atualizou = true;

                }

              }

            });

          }

        } 

      },

      criar : function( el ) {

        this.seletor.criar( el );

      }

    },

    UF : {

      elemento : 'UFs',

      criar : function( el ) {

        elementos = document.getElementsByClassName( el );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          seletor = document.createElement( 'select' );
          seletor.className = this.elemento;
    
          opcao = document.createElement( 'option' );
          opcao.selected = true;
          opcao.value = 'todos';
          opcao.text = 'Todos os Estados';

          seletor.appendChild( opcao );

          UFs = vis.dados.UFs;

          for ( var i = 0, leni = UFs.length; i < leni; i++ ) {

            UF = UFs[ i ];

            opcao = document.createElement( 'option' );
            opcao.value = UF.id;
            opcao.text = UF.nome;

            seletor.appendChild( opcao );

          }    

          elemento.appendChild( seletor );

          seletor.addEventListener( 'change', function() {

            vis.atual.UF = this.value;
            vis.atualizar();

          });

        }

      },

      atualizar : function( el ) {

        // atualiza filtro por estado

      }

    },

    municipio : {

      elemento : 'municipios',

      busca : {

        criar : function( el ) {

          elementos = document.getElementsByClassName( el );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];

            campo = document.createElement( 'input' );
            campo.type = 'search';
            campo.name = vis.filtros.municipio.elemento;
            campo.placeholder = 'Buscar município';

            elemento.appendChild( campo );

          }

        }

      },

      seletor : {

        criar : function( el ) {

          elementos = document.getElementsByClassName( el );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];

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
              UF = vis.obter.UF( municipio.id, 'sigla' );

              opcao = document.createElement( 'option' );
              opcao.value = municipio.id;
              opcao.text = municipio.nome + ', ' + UF;

              seletor.appendChild( opcao );

            }    

            elemento.appendChild( seletor );

            seletor.addEventListener( 'change', function() {

              vis.atual.local = this.value;
              vis.atualizar();

            });

          }

        },

        atualizar : function() {

          classe = vis.filtros.municipio.elemento;

          seletores = document.getElementsByClassName( classe );

          for ( var i = 0; i < seletores.length; i++ ) {

            seletor = seletores[ i ];

            seletor.value = vis.atual.local;

            // console.log( 'atualizado filtro de municipio' );

          }

        }

      },

      criar : function( el ) {

        this.busca.criar( el );
        this.seletor.criar( el );

      }

    },

    categoria : {

      criar : function( el ) {

        elementos = document.getElementsByClassName( el );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          categorias = vis.dados.categorias;

          for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

            categoria = categorias[ i ];

            if ( categoria.visivel ) {

              rotulo = document.createElement( 'label' );
              rotulo.appendChild( document.createTextNode( categoria.apelido ) );
              rotulo.htmlFor = categoria.sigla;

              seletor = document.createElement( 'input' );
              // seletor.type = 'checkbox';
              seletor.type = 'radio';
              seletor.name = 'categoria';
              seletor.value = categoria.sigla;
              seletor.id = categoria.sigla;
              seletor.checked = categoria.atual;
              
              rotulo.appendChild( seletor );

              seletor.addEventListener( 'change', function() {

                vis.atual.categoria = this.value;
                vis.atualizar();

              });

              elemento.appendChild( rotulo );

            }

          }

        }

      },

      atualizar : function() {

      }

    },

    criar : function( ) {

      el = this.elemento;

      this.categoria.criar( el );
      this.semana.criar( el );
      this.UF.criar( el );
      this.municipio.criar( el );

    }

  },

  classificacao : {

    elemento : 'classificacao',

    municipios : {

      elemento : 'municipios',

      itens : 20,

      criar : function() {

        classe = vis.classificacao.elemento + ' ' + this.elemento;

        elementos = document.getElementsByClassName( classe );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];
          
          ol = document.createElement( 'ol' );

          for ( var j = 0; j < this.itens; j++ ) {

            classificacao = document.createElement( 'div' );

            UF  = document.createElement( 'span' );

            nome  = document.createElement( 'div' );
            nome.appendChild( UF );

            casos = document.createElement( 'div' );

            unicos = document.createElement( 'div' );
            unicos.dataset.item = 'grafico';
            unicos.classList.add( 'grafico', 'unicos' );

            acumulado = document.createElement( 'div' );
            acumulado.dataset.item = 'grafico';
            acumulado.classList.add( 'grafico', 'acumulado' );

            li = document.createElement( 'li' );
            li.appendChild( classificacao );
            li.appendChild( nome );
            li.appendChild( unicos );
            li.appendChild( acumulado );
            li.appendChild( casos );

            if ( j == -1 ) {

              li.classList.add( 'cabecalho' );

            }

            ol.appendChild( li );

          }

          elemento.appendChild( ol );

        }

        this.atualizar();

      },

      atualizar : function() {

        vis.dados.municipios.sort( vis.dados.ordenar.desc );

        classe = vis.classificacao.elemento + ' ' + this.elemento;

        elementos = document.getElementsByClassName( classe );

        posicoes = [];

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];
          
          lis = elemento.getElementsByTagName( 'li' );

          for ( var j = 0; j < this.itens; j++ ) {

            li = lis[ j ];
            municipio = vis.dados.municipios[ j ];
            quantidade = vis.obter.acumulados( municipio, tipo ) || 0;
            empate = false;

            if ( j == 0 ) {
            
              posicao = 1;

            } else if ( quantidade != posicoes[ j - 1 ].quantidade ) {

              posicao = posicoes[ j - 1 ].posicao + 1;

            } else {

              posicao = posicoes[ j - 1 ].posicao;
              empate = true;

            }

            posicoes.push({
              
              quantidade : quantidade,
              posicao : posicao,

            });

            divs = li.getElementsByTagName( 'div' );

            span = divs[ 1 ].getElementsByTagName( 'span' )[ 0 ];
            span.appendChild( document.createTextNode( vis.obter.UF( municipio.id, 'sigla' ) ) )

            nome = document.createTextNode( municipio.nome );

            divs[ 0 ].className = empate ? 'empate' : '';
            divs[ 0 ].innerText = posicao + 'º';
            divs[ 1 ].appendChild( nome );
            divs[ 1 ].appendChild( span );
            divs[ 2 ].dataset.local = municipio.id;
            divs[ 3 ].dataset.local = municipio.id;
            divs[ 4 ].innerText = quantidade;            

            li.dataset.ibge = municipio.id;

          }

        }

        classe = vis.classificacao.elemento + ' ' + this.elemento;

        elementos = document.getElementsByClassName( classe );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          graficos = elemento.getElementsByClassName( 'grafico' );

          for ( var j = 0; j < graficos.length; j++ ) {

            grafico = graficos[ j ];

            local = grafico.dataset.local;

            if ( grafico.classList.contains( 'unicos' ) ) {

              grafico.appendChild( vis.graficos.evolucao.criar( local ) );

              vis.graficos.evolucao.atualizar( local );

            }

            else if ( grafico.classList.contains( 'acumulado' ) ) {

              grafico.appendChild( vis.graficos.circulo.criar( local ) );

              vis.graficos.circulo.atualizar( local );

            }

          }

        }

        // vis.graficos.evolucao.atualizar();

      }

    },

    UFs : {

      criar : function() {

        // console.log( 'cria classificao de UFs' );

        this.atualizar();

      },

      atualizar : function() {

        // console.log( 'atualiza classificao de UFs' );

      }

    },

    criar : function() {

      this.municipios.criar();
      this.UFs.criar();

    },

    atualizar : function () {

      this.municipios.atualizar();
      this.UFs.atualizar();

    }

  },

  criar : function() {

    vis.dados.requisicoes = [];

    for ( var i = 0; i < vis.dependencias.length; i++ ) {
      
      dependencia = vis.dependencias[ i ];
      tipo = dependencia.tipo;

      this.carregar[ tipo ]( dependencia );

    }

    $.when.apply( undefined, vis.dados.requisicoes ).then( function() {

      for ( var i = 0, j = 0; i < vis.dependencias.length; i++ ) {

        dependencia = vis.dependencias[ i ];

        if ( dependencia.tipo != 'script' ) {

          requisicao  = vis.dados.requisicoes[ j ];
          variavel    = dependencia.nome;
          json        = requisicao.responseJSON;

          vis.dados[ variavel ] = json;

          j++

        }

      }

      delete vis.dados.requisicoes;

      // diz qual é a categoria atual

      categorias = vis.dados.categorias;

      for ( var i = 0, leni = categorias.length; i < leni; i++ ) {

        categoria = categorias[ i ];

        if ( categoria.atual ) {

          vis.atual.categoria = categoria.sigla;

        }
          
      }

    });

  },

  atualizar : function() {

    // vis.classificacao.atualizar();
    // vis.fichas.atualizar();
    // vis.mapa.circulos.atualizar();

    vis.classificacao.atualizar();

    vis.fichas.atualizar();

    vis.mapa.circulos.atualizar();

    // vis.graficos.linhas.atualizar();

    vis.filtros.municipio.seletor.atualizar();

    // vis.filtros.atualizar();

    // vis.graficos.linhas.atualizar();

  }

};

vis.criar();
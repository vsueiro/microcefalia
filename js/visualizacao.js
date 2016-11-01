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

    total : {

      UF : function( UF ) {

        soma = 0;

        tipo = vis.atual.categoria;

        semana = vis.atual.semana();

        municipios = vis.dados.municipios;

        for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

          municipio = municipios[ i ];

          if ( UF == vis.obter.UF( municipio.id, 'id' ) ) {

            // quantidade = vis.obter.acumulados( municipio, tipo ) || 0;

            for ( var j = 0, lenj = municipio.casos.length; j < lenj; j++ ) { // pega dado da categoria na semana mais recente

              caso = municipio.casos[ j ];

              quantidade = 0;

              if ( caso.ano == semana.ano && caso.sem == semana.numero ) {

                if ( tipo in caso ) {

                  quantidade = caso[ tipo ];

                  soma += quantidade;

                  console.log( 'somou com ' + municipio.nome );

                }
                  
              }

            }

          }

        }

        console.log( vis.obter.UF( UF, 'nome' ) + ' tem ' + soma + ' casos ');

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

        console.log( this.classificacao );

      }

    },

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
      url : 'data/microcefalia-42-2016.json'
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

            vis.mapa.circulos.atualizar();

            vis.fichas.atualizar();

            vis.graficos.linhas.atualizar();

            vis.filtros.municipio.seletor.atualizar();
            
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
        // vis.graficos.linhas.criar();

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

              tamanho = Math.sqrt( parseInt( caso[ cat ] ) ) / Math.PI * vis.mapa.circulos.amplitude;
              
              circulo.getIcon().scale = tamanho;
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

    } 

  },

  graficos : {

    linhas :  {

      elemento : 'acumulado',

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

        espessura : 4,
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

      criar : function( cat ) {

        cat = cat || 'c';

        this.categoria.max = this.calcular( 'max', cat   );
        this.categoria.min = this.calcular( 'min', cat   );
        this.semana.max    = this.calcular( 'max', 'sem' );
        this.semana.min    = this.calcular( 'min', 'sem' );

        svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'version', '1.1' );
        // svg.setAttribute( 'id', 'grafico-linhas' );
        svg.setAttribute( 'x', '0' );
        svg.setAttribute( 'y', '0' );
        svg.setAttribute( 'width', ( ( this.semana.max - this.semana.min ) * this.escala.x ) + ( this.escala.x * 2 ) );
        svg.setAttribute( 'height', ( this.categoria.max * this.escala.y ) + ( this.escala.y * 2) );
        svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' ); // http://www.w3.org/2000/xmlns/

        linhas = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
        linhas.setAttribute( 'id', 'linhas' );

        municipios = vis.dados.municipios;

        for ( var i = 0, leni = municipios.length; i < leni; i++ ) {

          municipio = municipios[ i ];

          grupo = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
          // grupo.setAttribute( 'data-indice', i );
          grupo.setAttribute( 'id', 'municipio-' + municipio.id );

          for ( var j = 0; j < ( municipio.casos.length - 1 ); j++ ) {

            caso = municipio.casos[ j ];

            temCasos = false;

            if ( caso[ cat ] ) {

              opacidade = ( 1 / this.categoria.max * caso[ cat ] );
              // opacidade = 1;

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

          if ( i == ( leni - 1 ) ) {

            use = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' );
            use.setAttribute( 'id', 'z-index' );
            use.setAttributeNS( 'http://www.w3.org/1999/xlink', 'xlink:href', '#municipio-' + municipio.id );

          }

        }

        svg.appendChild( linhas );
        svg.appendChild( use );

        document.getElementById( this.elemento ).appendChild( svg );

      },

      atualizar : function() {

        if ( vis.atual.local != 'todos' ) { // destacar linha do municipio atual

          id = vis.atual.local;

          linha = {

            todas : $( '#linhas g line' ),
            atual : $( '#linhas #municipio-' + id + ' line' )

          }

          linha.todas.attr( 'stroke', '#ccc' );

          linha.atual.attr( 'stroke', '#000' );
          linha.atual.attr( 'opacity', 1 );

          use = document.getElementById( 'z-index' );
          use.href.baseVal = '#municipio-' + id;

          // $( '#z-index' ).attr( 'xlink:href', '#municipio-' + id );

        }

      }

    },

    evolucao : {

      elemento : 'evolucao',

      escala : {

        x : 12

      },

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

      atualizar : function( id ) {

        tipo = vis.atual.categoria;

        if ( id == 'todos' ) {

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

          semanas = unicos( vis.obter.municipio( id ).casos ); 

        }

        elementos = document.getElementsByClassName( this.elemento );

        for ( var i = 0; i < elementos.length; i++ ) {

          elemento = elementos[ i ];

          lis = elemento.getElementsByTagName( 'li' );

          for ( var j = 0; j < lis.length; j++ ) {

            li = lis[ j ];

            sem = li.dataset.sem;
            ano = li.dataset.ano;
            consta = false;
            largura = vis.graficos.evolucao.escala.x;

            if ( sem <= vis.atual.semana().numero && ano <= vis.atual.semana().ano ) {

              li.classList.add( 'ativo' );

            } else {

              li.classList.remove( 'ativo' );

            }

            for ( var k = 0, lenk = semanas.length; k < lenk; k++ ) {

              semana = semanas[ k ];

              if ( semana.sem == sem && semana.ano == ano ) {

                if ( id == 'todos' ) {

                  quantidade = semana.casos.unicos[ tipo ] || 0;

                } else {

                  quantidade = semana[ tipo ] || 0;

                }

                altura = quantidade;

                if ( quantidade < 0 ) {

                  li.classList.add( 'negativo' );

                  altura = Math.abs( quantidade );

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

                  li.style.width = largura;

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

  fichas : {

    elemento : 'fichas',

    ativo : false,

    items : {

      local : {

        elemento : 'local',

        criar : function() {
            
          return 'Local: <span></span>';

        },

        atualizar : function( id ) {

          if ( id == 'todos' ) {

            conteudo = 'Brasil';

          } else {

            conteudo = vis.obter.municipio( id ).nome;

          }

          elementos = document.getElementsByClassName( vis.fichas.elemento );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];
  
            item = elemento.querySelectorAll( '[data-item="' + this.elemento + '"]' )[ 0 ];            

            span = item.getElementsByTagName( 'span' )[ 0 ];

            span.innerHTML = conteudo;

          }

        }

      },

      UF : {

        elemento : 'UF',

        criar : function() {

          return 'UF: <span></span>';

        },

        atualizar : function( id ) {

          if ( id == 'todos' ) {

            conteudo = '–';

          } else {

            conteudo = vis.obter.UF( id, 'nome' );

          }

          elementos = document.getElementsByClassName( vis.fichas.elemento );

          for ( var i = 0; i < elementos.length; i++ ) {

            elemento = elementos[ i ];
  
            item = elemento.querySelectorAll( '[data-item="' + this.elemento + '"]' )[ 0 ];            

            span = item.getElementsByTagName( 'span' )[ 0 ];

            span.innerHTML = conteudo;

          }

        }

      },

      data : {

        elemento : 'data',

        criar : function() {

          return 'Até: <span></span>';

        },

        atualizar : function( local ) {

          sem = vis.atual.semana();

          for ( var i = 0, leni = vis.dados.semanas.length; i < leni; i++ ) {

            semana = vis.dados.semanas[ i ];

            if ( semana.numero == sem.numero && semana.ano == sem.ano ) {

              conteudo = vis.filtros.semana.quando( semana.fim );

              elementos = document.getElementsByClassName( vis.fichas.elemento );

              for ( var i = 0; i < elementos.length; i++ ) {

                elemento = elementos[ i ];
      
                item = elemento.querySelectorAll( '[data-item="' + this.elemento + '"]' )[ 0 ];            

                span = item.getElementsByTagName( 'span' )[ 0 ];

                span.innerHTML = conteudo;

              }

              break

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

                  console.log( item );

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

    },

    criar : function( local ) {

      local = local || 'todos';

      this.totais();

      elementos = document.getElementsByClassName( this.elemento );

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];

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

        elemento.appendChild( ul );

        this.atualizar( local )

      }

    },

    atualizar : function( local ) {

      local = local || vis.atual.local;

      for ( nome in this.items ) {

        conteudo = this.items[ nome ].atualizar( local );

      }

    }

  },

  filtros : {

    elemento : 'filtros',

    vincular : {

      eventos : function() {



        // select_element.onchange = function() {
        //   var elem = (typeof this.selectedIndex === "undefined" ? window.event.srcElement : this);
        //   var value = elem.value || elem.options[elem.selectedIndex].value;
        //   alert(value);
        // }​

        $( document ).on( 'change', '.UFs', function() {

          vis.atual.UF = this.value;

          vis.atualizar();

        });

        $( document ).on( 'change', '.semanas', function() {

          index = $( '.semanas option:selected' ).index();

          step = vis.dados.semanas.length - index;

          vis.filtros.semana.deslizador.objeto.setStep( step, 0 );

          vis.atualizar();

        });

        $( document ).on( 'change', '.municipios', function() {

          vis.atual.local = this.value;

          // vis.mapa.centralizar();

          vis.atualizar();

        });

        $( document ).on( 'change', 'input[name=categoria]', function() {

          vis.atual.categoria = this.value;

          vis.atualizar();

        });

      }

    },

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

            vis.filtros.semana.deslizador.criar( el );

          }

        }

      },

      deslizador : {

        elemento : 'deslizador',

        criar: function( el ) {

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

              steps: vis.dados.semanas.length,
              slide: false,
              snap: true,
              x: 1,
              animationCallback: function( x, y ) {

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

                $( '#' + this.wrapper.id ).addClass( 'loaded' ).find( '.handle' ).text( vis.obter.semana() );

              },
              callback: function( x, y ) {

                vis.mapa.circulos.atualizar();

                vis.fichas.atualizar();

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
          opcao.text = 'Todo o Brasil';

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

          }

        },

        atualizar : function() {

          $( '.' + vis.filtros.municipio.elemento ).val( vis.atual.local );

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
      this.UF.criar( el );
      this.municipio.criar( el );
      this.semana.criar( el );

    }

  },

  classificacao : {

    elemento : 'classificacao',

    items : 5,

    criar : function() {

      elementos = document.getElementsByClassName( this.elemento );

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];
        
        ol = document.createElement( 'ol' );

        for ( var j = 0; j < this.items; j++ ) {

          classificacao = document.createElement( 'div' );

          nome = document.createElement( 'div' );

          casos = document.createElement( 'div' );

          li = document.createElement( 'li' );
          li.appendChild( classificacao );
          li.appendChild( nome );
          li.appendChild( casos );

          ol.appendChild( li );

        }

        elemento.appendChild( ol );

      }

      this.atualizar();

    },

    atualizar : function () {

      vis.dados.municipios.sort( vis.dados.ordenar.desc );

      elementos = document.getElementsByClassName( this.elemento );

      posicoes = [];

      for ( var i = 0; i < elementos.length; i++ ) {

        elemento = elementos[ i ];
        
        lis = elemento.getElementsByTagName( 'li' );

        for ( var j = 0; j < this.items; j++ ) {

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

          divs[ 0 ].className = empate ? 'empate' : '';
          divs[ 0 ].innerText = posicao + 'º';
          divs[ 1 ].innerText = municipio.nome;
          divs[ 2 ].innerText = quantidade;

          li.dataset.ibge = municipio.id;


        }

      }

      console.log( posicoes );

    }

  },

  criar : function() {

    vis.filtros.vincular.eventos();

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

    vis.classificacao.atualizar();
    vis.fichas.atualizar();
    vis.mapa.circulos.atualizar();
    // vis.graficos.linhas.atualizar();

  }

};

vis.criar();
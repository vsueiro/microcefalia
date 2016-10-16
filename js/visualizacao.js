var vis = {
  
  // var
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
  // ;

  carrega : {

    script : function( url ) {

      var script = document.createElement( 'script' );
          script.type = 'text/javascript';
          script.src = url;
          document.body.appendChild( script );

    }

  },

  dependencias : [

    {
      nome : 'Google Maps',
      tipo : 'script',      
      url : '//maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs&callback=vis.mapa.criar'
    }

  ],

  sobre : {

    titulo : 'Microcefalia em recém-nascidos no Brasil',
    descricao : 'O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos',

  },

  elemento : $( '.visualizacao' ),

  mapa : {

    elemento : $( '#mapa' ),

    circulos : {

      amplitude : 7.5,
      cor : {
 
        normal : '#333',
        destaque : '#222',
        selecionado : '#000'

      }

    },

    criar : function() {

      mapa = new google.maps.Map( document.getElementById( 'mapa' ), {

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

      // desenhaCirculos();

    }

  },

  graficos : {


  },

  iniciar : function() {

    for ( var i = 0; i < this.dependencias.length; i ++ ) {

      var dependencia = this.dependencias[ i ];

      this.carrega[ dependencia.tipo ]( dependencia.url );

    }

  }

  
  // function changeHTML( content ) {
  //   var element = document.getElementById( 'change' );
  //   element.innerHTML = content;
  // }

  // return {
  //   callChangeHTML: function( content ) {
  //     changeHTML( content );
  //   }
  // };

};

// interativo.callChangeHTML( 'oi' ); 

vis.iniciar();
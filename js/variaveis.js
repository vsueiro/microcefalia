var
    municipios,
    municipio,
    circulos,
    circulo,
    semanas,
    semana,
    caso,
    mapa,
    ficha,
    categorias,
    categoria,
    cor
;

ficha = $( '.ficha' );

cor = {

    "circulo" : {
        
        "normal" : "#0088cc",
        "destaque" : "#2c66ce"

    }

};

circulos = [];

semanas = [];

categorias = [ 

    {
      "apelido" : "ta",
      "nome" : "Total acumulado",
      "atual" : true
    },
    {
      "apelido" : "ti",
      "nome" : "Total investigado",
      "atual" : false
    },
    {
      "apelido" : "tc",
      "nome" : "Total confirmado",
      "atual" : false
    },
    {
      "apelido" : "td",
      "nome" : "Total descartado",
      "atual" : false
    },
    {
      "apelido" : "ton",
      "nome" : "Total de óbitos notificados",
      "atual" : false
    },
    {
      "apelido" : "toi",
      "nome" : "Total de óbitos investigados",
      "atual" : false
    },
    {
      "apelido" : "toc",
      "nome" : "Total de óbitos confirmados",
      "atual" : false
    },
    {
      "apelido" : "tod",
      "nome" : "Total de óbitos descartados",
      "atual" : false
    }

];
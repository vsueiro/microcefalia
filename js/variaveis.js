var
  totais,
  total,
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
  cor,
  consta,
  dataDasSemanas,
  meses,
  visualizacao,
  selecionado,
  tamanho,
  amplitude,
  deslizador
;

amplitude = 7.5;

ficha = $( '.ficha' );

visualizacao = $( '.visualizacao' );

tamanho = {

  "selecionado" : 0,
  "outros" : 0

};

cor = {

    "circulo" : {
        
        "normal" : "#333333",
        "destaque" : "#181818",
        "selecionado" : "#000000"

    }

};

circulos = [];

semanas = [];

totais = [];

categorias = [ 

    {
      "apelido" : "tn",
      "nome" : "Total notificado",
      "total" : 0,
      "atual" : false,
      "visivel" : false
    },
    {
      "apelido" : "ti",
      "nome" : "Total investigado",
      "total" : 0,
      "atual" : false,
      "visivel" : false
    },
    {
      "apelido" : "tc",
      "nome" : "Total confirmado",
      "total" : 0,
      "atual" : true,
      "visivel" : true
    },
    {
      "apelido" : "td",
      "nome" : "Total descartado", 
      "total" : 0,
      "atual" : false,
      "visivel" : false
    },
    {
      "apelido" : "ton",
      "nome" : "Total de óbitos notificados",
      "total" : 0,
      "atual" : false,
      "visivel" : false
    },
    {
      "apelido" : "toi",
      "nome" : "Total de óbitos investigados",
      "total" : 0,
      "atual" : false,
      "visivel" : false
    },
    {
      "apelido" : "toc",
      "nome" : "Total de óbitos confirmados",
      "total" : 0,
      "atual" : false,
      "visivel" : true
    },
    {
      "apelido" : "tod",
      "nome" : "Total de óbitos descartados",
      "total" : 0,
      "atual" : false,
      "visivel" : false
    }

];

meses = [

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

];

dataDasSemanas = [
  
  // {
  //   "numero" : 40,
  //   "ano" : 2016,
  //   "inicio" : "2016-10-02",
  //   "fim" : "2016-10-08"
  // },
  {
    "numero" : 39,
    "ano" : 2016,
    "inicio" : "2016-09-25",
    "fim" : "2016-10-01"
  },
  {
    "numero" : 38,
    "ano" : 2016,
    "inicio" : "2016-09-18",
    "fim" : "2016-09-24"
  },
  {
    "numero" : 37,
    "ano" : 2016,
    "inicio" : "2016-09-11",
    "fim" : "2016-09-17"
  },
  {
    "numero" : 36,
    "ano" : 2016,
    "inicio" : "2016-09-04",
    "fim" : "2016-09-10"
  },
  {
    "numero" : 35,
    "ano" : 2016,
    "inicio" : "2016-08-28",
    "fim" : "2016-09-03"
  },
  {
    "numero" : 34,
    "ano" : 2016,
    "inicio" : "2016-08-21",
    "fim" : "2016-08-27"
  },
  {
    "numero" : 33,
    "ano" : 2016,
    "inicio" : "2016-08-14",
    "fim" : "2016-08-20"
  },
  {
    "numero" : 32,
    "ano" : 2016,
    "inicio" : "2016-08-07",
    "fim" : "2016-08-13"
  },
  {
    "numero" : 31,
    "ano" : 2016,
    "inicio" : "2016-07-31",
    "fim" : "2016-08-06"
  },
  {
    "numero" : 30,
    "ano" : 2016,
    "inicio" : "2016-07-24",
    "fim" : "2016-07-30"
  },
  {
    "numero" : 29,
    "ano" : 2016,
    "inicio" : "2016-07-17",
    "fim" : "2016-07-23"
  },
  {
    "numero" : 28,
    "ano" : 2016,
    "inicio" : "2016-07-10",
    "fim" : "2016-07-16"
  },
  {
    "numero" : 27,
    "ano" : 2016,
    "inicio" : "2016-07-03",
    "fim" : "2016-07-09"
  },
  {
    "numero" : 26,
    "ano" : 2016,
    "inicio" : "2016-06-26",
    "fim" : "2016-07-02"
  },
  {
    "numero" : 25,
    "ano" : 2016,
    "inicio" : "2016-06-19",
    "fim" : "2016-06-25"
  },
  {
    "numero" : 24,
    "ano" : 2016,
    "inicio" : "2016-06-12",
    "fim" : "2016-06-18"
  },
  {
    "numero" : 23,
    "ano" : 2016,
    "inicio" : "2016-06-05",
    "fim" : "2016-06-11"
  },
  {
    "numero" : 22,
    "ano" : 2016,
    "inicio" : "2016-05-29",
    "fim" : "2016-06-04"
  },
  {
    "numero" : 21,
    "ano" : 2016,
    "inicio" : "2016-05-22",
    "fim" : "2016-05-28"
  },
  {
    "numero" : 20,
    "ano" : 2016,
    "inicio" : "2016-05-15",
    "fim" : "2016-05-21"
  },
  {
    "numero" : 19,
    "ano" : 2016,
    "inicio" : "2016-05-08",
    "fim" : "2016-05-14"
  },
  {
    "numero" : 18,
    "ano" : 2016,
    "inicio" : "2016-05-01",
    "fim" : "2016-05-07"
  },
  {
    "numero" : 17,
    "ano" : 2016,
    "inicio" : "2016-04-24",
    "fim" : "2016-04-30"
  },
  {
    "numero" : 16,
    "ano" : 2016,
    "inicio" : "2016-04-17",
    "fim" : "2016-04-23"
  },
  {
    "numero" : 15,
    "ano" : 2016,
    "inicio" : "2016-04-09",
    "fim" : "2016-04-16"
  },
  {
    "numero" : 14,
    "ano" : 2016,
    "inicio" : "2016-04-03",
    "fim" : "2016-04-09"
  },
  {
    "numero" : 13,
    "ano" : 2016,
    "inicio" : "2016-03-27",
    "fim" : "2016-04-02"
  },
  {
    "numero" : 12,
    "ano" : 2016,
    "inicio" : "2016-03-20",
    "fim" : "2016-03-26"
  },
  {
    "numero" : 11,
    "ano" : 2016,
    "inicio" : "2016-03-13",
    "fim" : "2016-03-19"
  },
  {
    "numero" : 10,
    "ano" : 2016,
    "inicio" : "2016-03-05",
    "fim" : "2016-03-12"
  },
  {
    "numero" : 09,
    "ano" : 2016,
    "inicio" : "2016-02-28",
    "fim" : "2016-03-05"
  },
  {
    "numero" : 08,
    "ano" : 2016,
    "inicio" : "2016-02-21",
    "fim" : "2016-02-27"
  },
  {
    "numero" : 07,
    "ano" : 2016,
    "inicio" : "2016-02-14",
    "fim" : "2016-02-20"
  },
  {
    "numero" : 06,
    "ano" : 2016,
    "inicio" : "2016-02-07",
    "fim" : "2016-02-13"
  },
  {
    "numero" : 05,
    "ano" : 2016,
    "inicio" : "2016-01-31",
    "fim" : "2016-02-06"
  },
  {
    "numero" : 04,
    "ano" : 2016,
    "inicio" : "2016-01-24",
    "fim" : "2016-01-30"
  },
  {
    "numero" : 03,
    "ano" : 2016,
    "inicio" : "2016-01-17",
    "fim" : "2016-01-23"
  },
  {
    "numero" : 02,
    "ano" : 2016,
    "inicio" : "2016-01-10",
    "fim" : "2016-01-16"
  },
  {
    "numero" : 01,
    "ano" : 2016,
    "inicio" : "2016-01-03",
    "fim" : "2016-01-09"
  },
  {
    "numero" : 52,
    "ano" : 2015,
    "inicio" : "2015-12-27",
    "fim" : "2016-01-02"
  },
  {
    "numero" : 51,
    "ano" : 2015,
    "inicio" : "2015-12-20",
    "fim" : "2015-12-26"
  },
  {
    "numero" : 50,
    "ano" : 2015,
    "inicio" : "2015-12-13",
    "fim" : "2015-12-19"
  },
  {
    "numero" : 49,
    "ano" : 2015,
    "inicio" : "2015-12-06",
    "fim" : "2015-12-12"
  },
  {
    "numero" : 48,
    "ano" : 2015,
    "inicio" : "2015-11-29",
    "fim" : "2015-12-05"
  },
  {
    "numero" : 47,
    "ano" : 2015,
    "inicio" : "2015-11-22",
    "fim" : "2015-11-28"
  },
  {
    "numero" : 46,
    "ano" : 2015,
    "inicio" : "2015-11-15",
    "fim" : "2015-11-21"
  },
  {
    "numero" : 45,
    "ano" : 2015,
    "inicio" : "2015-11-08",
    "fim" : "2015-11-14"
  }
  
];
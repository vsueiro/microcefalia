<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <meta name="viewport" content="width=1024">
    <title>Microcefalia em recém-nascidos no Brasil</title>
    <meta name="author" content="Vinicius Sueiro" />
    <meta name="description" content="Visualização de dados mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central desde novembro de 2015, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css" />
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:300,400,700,800">
    <link rel="stylesheet" href="css/core.css">
    <link rel="stylesheet" href="css/vis.css">
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-53267189-1', 'auto');
      ga('send', 'pageview');
    </script>
  </head>
  <body>

    <div class="involucro">
      <article class="visualizacao">    
        <div class="grupo">
          <header>
            <h1>Microcefalia em recém-nascidos no Brasil</h1>
            <p>Visualização de dados mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central desde novembro de 2015, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também por óbitos</p>
          </header>
        </div>
        <div class="grupo">
          <form class="filtros"></form>
        </div>
        <div class="grupo">
          <div class="grafico mapa"></div> 
          <section class="totais"></section>
        </div>
        <div class="grupo">
          <section class="classificacao municipios"></section>
        </div>
        <nav class="navegacao"></nav>
        <!-- <section class="grafico acumulado municipios"></section> -->
        <!-- <section class="grafico acumulado UFs"></section> -->
      </article>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="libs/dragdealer.js"></script>
    <script src="js/core.js"></script>
    <script src="js/vis.js"></script>
  </body>
</html>
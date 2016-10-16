<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">

    <link rel="stylesheet" type="text/css" href="libs/dragdealer.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <title>Mapa da microcefalia no Brasil</title>

  </head>
  <body>

    <article class="visualizacao">

      <h1>Microcefalia em recém-nascidos no Brasil</h1>

      <p>O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também pelo tipo de caso (confirmado, investigado, descartado etc)</p>

      <section class="totais">
        
        <p></p>

        <ul>
          <li data-caso="tc"></li>
          <li data-caso="toc"></li>
        </ul>

      </section>

      <form>

        <select class="semanas">
          <option disabled>Escolha a semana epidemiológica</option>
        </select>

        <select class="categorias">
          <option disabled>Escolha o tipo de caso</option>
        </select>

        <input type="search" name="municipio" placeholder="Buscar por município">

      </form>
      
      <div id="semana-slider" class="dragdealer">
        <div class="handle red-bar"></div>
      </div>

      <div id="mapa"></div>

      <ul class="ficha"></ul>

      <br>

      <nav>

        <button>Baixar dados</button>
        <button onclick="baixar( 'grafico-linhas', 'grafico' )">Baixar svg (vetor)</button>
        <button>Baixar pdf (impressão)</button>
        <button>Incorporar ao meu site</button>
        <button>Tela cheia</button>

      </nav>

      <br>

      <div id="grafico-linhas"></div>
      


    </article>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="libs/dragdealer.js"></script>
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <!--<script src="js/app.js"></script>-->

  </body>
</html>
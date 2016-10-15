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

      <footer>

        <dl>
          
          <dt>Observações</dt>
          <dd>
            No período entre a semana epidemiológica 45/2015 e a 05/2016 (8 de novembro de 2015 a 6 de fevereiro de 2016, respectivamente) os casos eram informados de forma agregada por UF; a desagregação por município e de acordo com a classificação (notificados, em investigação, confirmados e descartados) só teve início a partir da semana epidemiológica 06/2016 (7 de fevereiro de 2016)
          </dd>
          <dd>
            Total Acumulado = Total Notificado = Total Investigado + Total Confirmado + Total Descartado
          </dd>
          <dd>
            Total Óbito Notificado = Total Óbito Investigado + Total Óbito Confirmado + Total Óbito Descartado
          </dd>

          <dt>Método</dt>
          <dd>
            -
          </dd>

          <dt>Fontes</dt>
          <dd>-</dd>

          <dt>Colabore</dt>
          <dd>
            Esta visualização de dados é de código aberto. Caso queira colaborar ou criar sua própria, utilize este <a href="#">repositório Git</a>
          </dd>

        </dl>

      </footer>

      <div id="grafico-linhas"></div>
      


    </article>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="libs/dragdealer.js"></script>
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

  </body>
</html>
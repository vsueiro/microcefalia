<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <title>Mapa de microcefalia no Brasil</title>

  </head>
  <body>

    <article class="visualizacao">

      <h1>Microcefalia em recém nascidos no Brasil</h1>

      <p>O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também pelo tipo de caso (confirmado, investigado, descartado etc)</p>

      <!-- <p>Dados atualizados até 8 de setembro de 2016</p> -->

      <form>

        <select class="semanas">
          <option disabled>Escolha a semana epidemiológica</option>
        </select>

        <select class="categorias">
          <option disabled>Escolha o tipo de caso</option>
        </select>

        <input type="search" name="municipio" placeholder="Buscar por município">

      </form>
      
      <br>

      <div id="mapa"></div>

      <ul class="ficha"></ul>

      <br>

      <nav>

        <button>Baixar dados</button>
        <button>Baixar svg (vetor)</button>
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

          <dt>Método</dt>
          <dd>
            Praesent vitae massa vestibulum, fermentum purus ac, lacinia urna. Nam justo turpis, ultricies quis libero vel, laoreet porttitor elit. Sed hendrerit neque vel erat tincidunt tempor. Integer auctor auctor ligula. Donec sagittis lacinia tincidunt. Maecenas laoreet, risus quis blandit convallis, enim ante viverra mauris, sit amet volutpat nunc mi nec tortor. Donec nec elementum mi, id sodales urna. Aliquam laoreet sem in vestibulum mattis. Fusce auctor efficitur venenatis. Cras tortor lacus, eleifend vel est in, malesuada fringilla sapien. Quisque in diam nec leo mattis molestie ut ut lorem. In sit amet iaculis
          </dd>

          <dt>Fontes</dt>
          <dd><a href="#">FonteA</a>, <a href="#">FonteB</a>, <a href="#">FonteC</a></dd>

          <dt>Colabore</dt>
          <dd>
            Esta visualização de dados é de código aberto. Caso queira colaborar ou criar sua própria, utilize este <a href="#">repositório Git</a>
          </dd>

        </dl>

      </footer>

    </article>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

  </body>
</html>
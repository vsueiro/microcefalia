<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">

    <title>Mapa de microcefalia no Brasil</title>

    <style>

      html,
      body {
        height: 100%;
        font-family: 'Open Sans', sans-serif;
      }
      #mapa {
        width: 970px;
        height: 970px;
      }
      .ficha {
        border: 2px solid #eee;
      }

    </style>

  </head>
  <body>

    <h1>Microcefalia em recém nascidos no Brasil</h1>

    <p>O mapa abaixo mostra a evolução dos casos de microcefalia e/ou alterações no sistema nervoso central, incluindo casos de óbito decorrentes desta condição. O tamanho dos círculos representa a quantidade de casos naquele município. É possível filtrar por cada semana da epidemia e também pelo tipo de caso (confirmado, investigado, descartado etc)</p>

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

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

  </body>
</html>
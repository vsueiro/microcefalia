<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tratamento de dados – TCC</title>
  </head>
  <body>

    <?php

      $xml = simplexml_load_file('data/br-localidades-2010-v1.kml');

      // print_r( $xml );

      // print_r( $xml->Document->Folder->Placemark );

      $localidades = '';

      $quantidadeDeLocais = 0;

      // foreach ( $xml->Document->Folder as $folder) {

        foreach ( $xml->Document->Folder->Placemark as $lugar ) {

          //foreach ( $lugar->ExtendedData->SchemaData->SimpleData ) {

          $dados = $lugar->ExtendedData->SchemaData->SimpleData;

          echo
            '{'. '<br>'.
              '"id-ibge" : ' . $dados[ 9 ] . ',<br>'. // 9 CD_GEOCODMU
              '"nome" : "' . $dados[ 17 ] . '",<br>'. // 17 NM_LOCALIDADE
              '"longitude" : "' . $dados[ 18 ] . '",<br>'. // 18 LONG
              '"latitude" : "' . $dados[ 19 ] . '",<br>'. // 19 LAT
              '"altitude" : "' . $dados[ 20 ] . '"<br>'. // 20 ALT
            '},<br>'
          ;

          // }

          $quantidadeDeLocais++;

          // echo '<br>---------------------------------------------------------------------<br><br>';

        }

      // }

      // echo "QUANTIDADE DE LOCAIS = ".$quantidadeDeLocais;


    ?>

    <?php
    /*
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <!-- <script src="data/lista-microcefalia-2016-08-21.json"></script> Atualizado até 17/08/2016 às 00:00 - source: http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=204482459&cor=005984&nonono=html&title=&codPainel=176 -->
    <!-- <script src="data/codigo-dos-municipios.json"></script> source: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip -->
    <script src="data/codigo-dos-municipios-talvez-mais-completo.json"></script> <!-- source: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip (arquivo: RELATORIO_DTB_BRASIL_MUNICIPIO.xls) -->
    <script src="data/codigo-das-UF.js"></script> <!--  source: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2015/dtb_2015.zip -->
    <script src="data/br-localidades-2010-v1.kml"></script> <!-- source: ftp://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Google_KML/ -->
    <script src="js/variaveis.js"></script>
    <script src="js/funcoes.js"></script>
    <script src="js/app.js"></script>

    */
    ?>
  </body>
</html>

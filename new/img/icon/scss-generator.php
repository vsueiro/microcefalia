<?php

  $scss = "@import 'svg-url'; \n";

  foreach ( glob( 'svg/*.svg' ) as $path ) {

    $svg = file_get_contents( $path, FILE_USE_INCLUDE_PATH );
    $file = basename( $path, '.svg' );

    $scss .= 'i[data-icon="' . $file . '"]:before { background-image: svg-url(\'' . $svg . '\') }' . "\n";

  }

  file_put_contents( '../../scss/icons.scss', $scss );

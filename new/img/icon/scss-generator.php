<?php

  $scss = "@import '_svg-url'; \n";

  foreach ( glob( 'svg/*.svg' ) as $path ) {

    $svg   = file_get_contents( $path, FILE_USE_INCLUDE_PATH );
    $file  = basename( $path, '.svg' );
    $arr   = preg_split( '/\-(?=[^-]*$)/', $file ); // split by last -
    $icon  = $arr[ 0 ];
    $color = $arr[ 1 ];
    $scss .= 'i[data-icon="' . $icon . '"][data-color="' . $color . '"]:before { background-image: svg-url(\'' . $svg . '\') }' . "\n";

  }
  echo $scss;
  file_put_contents( '../../scss/_icons.scss', $scss );

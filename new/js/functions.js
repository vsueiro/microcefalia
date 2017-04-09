each = function( thing, callback, parent ) {

  var list, isArray, get;

  parent = parent || document;

  get = function( thing ) {

    if ( typeof thing === 'string' ) {
      
      list = parent.getElementsByClassName( thing );
      if ( list.length ) return list

      list = parent.getElementsByTagName( thing );
      if ( list.length ) return list

      list = parent.querySelectorAll( thing );
      if ( list.length ) return list

      return null
    }

    return thing
  }

  list = get( thing );
	
	isArray = list.constructor === Array ? true : false;

	for ( var i = 0 ; i < list.length ; i++ ) {

		if ( isArray ) callback.call( list[ i ], list[ i ], i )
		else           callback.call( list[ i ], i )

	}
}

the = function( thing, parent ) {

  var item, list;

  parent = parent || document;

  item = document.getElementById( thing );
  if ( item !== null ) return item

  list = parent.getElementsByClassName( thing );
  if ( list.length ) return list[ 0 ]

  list = parent.getElementsByTagName( thing );
  if ( list.length ) return list[ 0 ]

  item = document.querySelector( thing );
  if ( item !== null ) return item

	return null
}

closest = function( className, element ) {
    while ( ( element = element.parentElement) && !element.classList.contains( className ) );
    return element
}

touch = function() {

  return ( 'ontouchstart' in window || navigator.maxTouchPoints ) || false

}

browser = function() {

  browsers = [];
  opera = ( !!window.opr && !!opr.addons ) || !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;
  firefox = typeof InstallTrigger !== 'undefined';
  ie = /*@cc_on!@*/false || !!document.documentMode;
  edge = !ie && !!window.StyleMedia;
  chrome = !!window.chrome && !!window.chrome.webstore;
  blink = ( chrome || opera ) && !!window.CSS;
  safari = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0 || !chrome && !opera && window.webkitAudioContext !== undefined;

  if ( opera )   browsers.push( 'opera' )
  if ( firefox ) browsers.push( 'firefox' )
  if ( ie )      browsers.push( 'ie' )
  if ( edge )    browsers.push( 'edge' )
  if ( chrome )  browsers.push( 'chrome' )
  if ( blink )   browsers.push( 'blink' )
  if ( safari )  browsers.push( 'safari' )

  return browsers.join()

}

isActive = function( element ) {
  if ( element.classList.contains( 'active' ) )
    return true
  return false
}

thousands = function( x ) {
  var parts = x.toString().split( ',' );
  parts[ 0 ] = parts[ 0 ].replace( /\B(?=(\d{3})+(?!\d))/g , '.' );
  return parts.join( ',' );
}
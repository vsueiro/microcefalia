each = function( thing, callback, parent ) {

  var list, isArray, get;

  parent = parent || document;

  get = function( thing ) {

    if ( typeof thing === 'string' ) {
      
      list = parent.getElementsByClassName( thing );
      if ( list.length ) return list

      list = parent.getElementsByTagName( thing );
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

	return null
}

closest = function( className, element ) {
    while ( ( element = element.parentElement) && !element.classList.contains( className ) );
    return element
}

isActive = function( element ) {
  if ( element.classList.contains( 'active' ) )
    return true
  return false
}

/*

each( 'class-name', function( index ) {
  console.log( this, index );
});

each( 'div', function( index ) {
  console.log( this, index );
});

var letters = [ 'a', 'b', 'c' ];

each( letters, function( letter, index ) {
  console.log( letter, index );
});

var people = [
  {
    name : 'Jane Doe',
    age : 25
  },
  {
    name : 'John Doe',
    age : 32
  }
];

each( people, function( person ) {
  console.log( person.name + ' is ' + person.age );
});

console.log( the( 'unique-id' ) );
console.log( the( 'class-name' ) );
console.log( the( 'div' ) );

*/
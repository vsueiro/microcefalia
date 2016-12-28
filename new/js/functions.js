each = function( thing, callback ) {

  var list, isArray, get;

  get = function( thing ) {

    if ( typeof thing === 'string' ) {
      
      list = document.getElementsByClassName( thing );
      if ( list.length ) return list

      list = document.getElementsByTagName( thing );
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

the = function( thing ) {

  var item, list;

  item = document.getElementById( thing );
  if ( item !== null ) return item

  list = document.getElementsByClassName( thing );
  if ( list.length ) return list[ 0 ]

  list = document.getElementsByTagName( thing );
  if ( list.length ) return list[ 0 ]

	return null
}


/*
// each – test cases

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

// the – test cases

console.log( the( 'unique-id' ) );
console.log( the( 'class-name' ) );
console.log( the( 'div' ) );
*/
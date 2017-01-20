url         = 'http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=204482459&cor=005984&nonono=html&title=&codPainel=176';
curl        = require( 'curlrequest' );
fs          = require( 'fs' );
coordinates = require( '../data/coordinates.json' );
cities      = {
	ids     : [],
	data    : [],
	counter : 0
};

curl.request( url, function ( error, response ) {

	entries = JSON.parse( response ).resultset;

	// merge same city occurences
	for ( var i = 0; i < entries.length; i++ ) {
		entry = entries[ i ];

		city = {
			id : parseInt( entry[ 0 ] ), // ibge
			s : entry[ 1 ], // state
			n : entry[ 2 ], // name
			c : [] // cases
		};

		ocurrence = {
			y  : parseInt( entry[ 4 ]  ) - 2016, // year
			w  : parseInt( entry[ 3 ]  ),        // week
			ci : parseInt( entry[ 6 ]  ),        // cases investigation
			cc : parseInt( entry[ 7 ]  ),        // cases confirmed
			cd : parseInt( entry[ 8 ]  ),        // cases discarded
			ci : parseInt( entry[ 10 ] ),        // deaths investigation
			cc : parseInt( entry[ 11 ] ),        // deaths confirmed
			cd : parseInt( entry[ 12 ] )         // deaths discarded
		};

		if ( cities.ids.indexOf( city.id ) >= 0 ) { // exists

			cities.data[ cities.counter - 1 ].c.push( ocurrence );

		} else { // does not exist

			cities.ids.push( city.id );
			city.c.push( ocurrence );
			cities.data[ cities.counter ] = city;
			
			cities.counter++

		}
	}
	
	// match cities with their coordinates
	for ( var i = 0; i < cities.data.length; i++ ) {
		city = cities.data[ i ];

		for ( var j = 0; j < coordinates.length; j++ ) {
			coordinate = coordinates[ j ];
			id = String( coordinate.id ).slice( 0, -1 ); // convert ibge id from 7 to 6 digits

			if ( city.id == id ) {
				found = true;
				city.id = coordinate.id;
				city.g = {
					lat : parseFloat( coordinate.lat ),
					lng : parseFloat( coordinate.lng )
				}
			}
		}
	}

	// remove cases and cities that have zero values
	i = cities.data.length;

	while ( i-- ) {
		j = cities.data[ i ].c.length;
		empty = true;

		while ( j-- ) {
			occurence = cities.data[ i ].c[ j ]; 
			if ( occurence.cc == 0 ) delete occurence.cc;
			if ( occurence.cd == 0 ) delete occurence.cd;
			if ( occurence.ci == 0 ) delete occurence.ci;
			if ( occurence.dc == 0 ) delete occurence.dc;
			if ( occurence.dd == 0 ) delete occurence.dd;
			if ( occurence.di == 0 ) delete occurence.di;

			if ( Object.keys( occurence ).length > 2 ) // has occurences
				empty = false;
			else
				cities.data[ i ].c.splice( j, 1 ); // remove empty occurence object
		}

		if ( empty )
			cities.data.splice( i, 1 );  // remove empty city object
	}

	// save file
	json = JSON.stringify( cities.data );
	fs.writeFile( '../data/cities.json', json, function( error ) {
		if ( error ) return console.log( error );
		console.log( 'Saved cities.json!' )
	}); 

	// next steps (to avoid heavy browser processing):
	// • calculate state totals
	// • calculate country totals
	// • order cities by confirmed cases ranking

});
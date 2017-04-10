// run this file on terminal using Node

url         = 'http://sage.saude.gov.br/paineis/microcefalia/listaMicrocefalia.php?output=json&ufs=&ibges=&cg=&tc=&re_giao=&rm=&qs=&ufcidade=Brasil&qt=5570%20munic%C3%ADpios&pop=206114067&cor=005984&nonono=html&title=&codPainel=176';
curl        = require( 'curlrequest' );
fs          = require( 'fs' );
coordinates = require( '../data/coordinates.json' );
states 		= require( '../data/states.json' );
categories  = require( '../data/categories.json' );
cities      = {
	ids     : [],
	data    : [],
	counter : 0
};
mostRecent = {
	w : 50,
	y : 0 // 2016
};
weeks = [];

curl.request( url, function ( error, response ) {

	entries = JSON.parse( response ).resultset;

	// merge same city occurrences
	for ( var i = 0; i < entries.length; i++ ) {
		entry = entries[ i ];

		city = {
			id : parseInt( entry[ 0 ] ), // ibge
			s : entry[ 1 ], // state
			n : entry[ 2 ], // name
			c : [] // cases
		};

		occurrence = {
			y  : parseInt( entry[ 4 ]  ) - 2016, // year
			w  : parseInt( entry[ 3 ]  ),        // week
			ci : parseInt( entry[ 6 ]  ),        // cases investigation
			cc : parseInt( entry[ 7 ]  ),        // cases confirmed
			cd : parseInt( entry[ 8 ]  ),        // cases discarded
			di : parseInt( entry[ 10 ] ),        // deaths investigation
			dc : parseInt( entry[ 11 ] ),        // deaths confirmed
			dd : parseInt( entry[ 12 ] )         // deaths discarded
		};

		// stores unique weeks
		function leadingZero( n ) { return n < 10 ? '0' + n : n }
		week = occurrence.y + '-W' + leadingZero( occurrence.w ); // iso format
		if ( weeks.indexOf( week ) === -1 ) {
			weeks.push( week );
		}
		
		if ( cities.ids.indexOf( city.id ) >= 0 ) { // exists

			cities.data[ cities.counter - 1 ].c.push( occurrence );

		} else { // does not exist

			cities.ids.push( city.id );
			city.c.push( occurrence );
			cities.data[ cities.counter ] = city;
			
			cities.counter++

		}
	}

	// calculate each week start and end dates
	weeks.sort();

	Date.prototype.offset = function( days ) {
		var offset = new Date( this.valueOf() );
		offset.setDate( offset.getDate() + days );
		return offset;
	}

	function weekDates( year, week ) {

	  function firstWeek( year ) {
	  
	    var firstDay = new Date( year, 0, 1, 0, 0, 0 ); // january first
	    var weekDay = firstDay.getDay(); // get week day from 0 (sunday) to 6 (saturday)
	    var start, end;

	    if ( weekDay <= 3 ) { // is first epidemiological week of current year
	      start = firstDay.offset( - weekDay );
	      end = firstDay.offset( 6 - weekDay );
	    } else { // is last epidemiological week of last year
	      start = firstDay.offset( 6 - weekDay + 1);
	      end = start.offset( 6 );
	    }

	    return {
	    	start : start,
	    	end: end
	    }
	  }
	  
	  var first = firstWeek( year );
	  var offset = 7 * ( week - 1 );
	  
	  return {
	    start : first.start.offset( offset ),
	    end : first.end.offset( offset )
	  }
	}

	function onlyDate( date ) {
		var iso = date.toISOString();
		var n = iso.indexOf( 'T' );
		return iso.substring( 0, n != -1 ? n : iso.length );
	}

	for ( var i = 0; i < weeks.length; i++ ) {
		var parts = weeks[ i ].split( '-W' );
		var y = parseInt( parts[ 0 ] ) + 2016;
		var w = parseInt( parts[ 1 ] );
		var date = weekDates( y, w );
		var object = {
			y : y,
			w : w,
			start : onlyDate( date.start ), 
			end : onlyDate( date.end ) 
		};
		weeks[ i ] = object;
	}

	// save file
	json = JSON.stringify( weeks );
	fs.writeFile( '../data/weeks.json', json, function( error ) {
		if ( error ) return console.log( error );
		console.log( 'Saved weeks.json' );
	}); 

	// match cities with their coordinates
	for ( var i = 0; i < cities.data.length; i++ ) {
		city = cities.data[ i ];

		for ( var j = 0; j < coordinates.length; j++ ) {
			coordinate = coordinates[ j ];
			id = String( coordinate.id ).slice( 0, -1 ); // convert ibge id from 7 to 6 digits

			if ( city.id == id ) {
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
			occurrence = cities.data[ i ].c[ j ]; 
			if ( occurrence.cc == 0 ) delete occurrence.cc;
			if ( occurrence.cd == 0 ) delete occurrence.cd;
			if ( occurrence.ci == 0 ) delete occurrence.ci;
			if ( occurrence.dc == 0 ) delete occurrence.dc;
			if ( occurrence.dd == 0 ) delete occurrence.dd;
			if ( occurrence.di == 0 ) delete occurrence.di;

			if ( Object.keys( occurrence ).length > 2 ) // has occurrences
				empty = false;
			else
				cities.data[ i ].c.splice( j, 1 ); // remove empty occurrence object
		}

		if ( empty )
			cities.data.splice( i, 1 );  // remove empty city object
	}

	// save file
	json = JSON.stringify( cities.data );
	fs.writeFile( '../data/cities.json', json, function( error ) {
		if ( error ) return console.log( error );
		console.log( 'Saved cities.json' );
	}); 

	// calculate state totals
	for ( var i = 0; i < states.length; i++ ) {

		state = states[ i ];

		for ( var j = 0; j < cities.data.length; j++ ) {

			city = cities.data[ j ];

			if ( city.s === state.initials ) { // if city matches current state

				last = city.c[ city.c.length - 1 ];

				if ( last.y == mostRecent.y && last.w == mostRecent.w ) { // city has data for the most recent week

					if ( !( 'c' in state ) ) {
						state.c = {};
					}

					for ( var k = 0; k < categories.length; k++ ) {

						category = categories[ k ];
						initials = category.initials;

						if ( !( initials in state.c ) ) {
							state.c[ initials ] = 0;
						}

						state.c[ initials ] += ( last[ initials ] || 0 );

					}

				} else {
					console.log( 'city’s last reported week (' + last.w + ') is not the most recent: ' + city.n + ', ' + city.s );
				}
			} 
		}
	}

	// save file
	json = JSON.stringify( states, null, 4 );
	fs.writeFile( '../data/states-totals.json', json, function( error ) {
		if ( error ) return console.log( error );
		console.log( 'Saved states-totals.json!' );
	}); 

	// calculate country totals
	country = {
		n : 'Brasil',
		c : {}
	};

	for ( var i = 0; i < states.length; i++ ) {

		state = states[ i ];

		for ( var j = 0; j < categories.length; j++ ) {

			category = categories[ j ];
			initials = category.initials;

			if ( !( initials in country.c ) ) {
				country.c[ initials ] = 0;
			}

			country.c[ initials ] += ( state.c[ initials ] || 0 );

		}

	}

	// save file
	json = JSON.stringify( country, null, 4 );
	fs.writeFile( '../data/country-totals.json', json, function( error ) {
		if ( error ) return console.log( error );
		console.log( 'Saved country-totals.json!' )
	}); 

	// next steps (to avoid heavy browser processing):

	// • calculate state totals
	// • calculate state evolution

	// • calculate country totals
	// • calculate country evolution

	// • calculate region totals
	// • calculate region evolution

	// • order cities by confirmed cases ranking

});
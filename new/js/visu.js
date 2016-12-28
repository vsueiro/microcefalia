each = function( thing, callback ) {
	if ( typeof thing === 'string' ) {
		thing = document.getElementsByClassName( thing );
	}
	for ( var i = 0, len = thing.length; i < len; i++ ) {
		callback.call( thing[ i ], i )
	}
}

the = function( thing ) {
	if ( typeof thing === 'string' ) {
		thing = document.getElementsByClassName( thing );
	}
	return thing[ 0 ]
}

/*

How to use:

each( 'filter', function() { 		// parameter can be class names or node list
	console.log( this ); 			// multiple nodes
});

each( 'filter', function( index ) {
	console.log( this, index ); 	// multiple nodes and numbers
});

the( 'filter', function() {
	console.log( this ); 			// only first node
});

*/

var visu = {

	options : {
		element : 'visu',
		status : 'loading',
		category : undefined,
		location : undefined,
		time : undefined
	},

	dependencies : {
		list : [],
		load : function() {
			script = function() {}
			json = function() {}
			this.callback();
		},
		callback : function() {
			visu.interaction.initialize();
		}
	},

	get : {
		status : function() {},
		category : function() {},
		location : function() {},
		time : function() {},
		totals : function() {},
 		current : {
 			category : function() {},
			location : function() {},
			time : function() {},
			totals : function() {}
		},
		file : {
			json : {},
			csv : {},
			svg : {},
			png : {},
		}
	},

	set : {
		status : function() {},
		category : function() {},
		location : function() {},
		time : function() {},
	},

	data : {
		list : [],
		order : {
			asc : function() {},
			desc: function() {}
		}
	},

	components : {
		about : {
			header : {},
			description : {},
			footer : {},
		},
		navigation : {
			
		},
		filters : {
			category : {},
			location : {},
			time : {}
		},
		graphics : {
			unique : {},
			cumulative : {},
			map : {},
		},
		ranking : {

		},
		related : {

		}
	},

	interaction : {
		initialize : function() {

			search = the( 'search' );
			locationFilter = the( 'location filter' );

			search.addEventListener( 'focus', function() {
				locationFilter.dataset.search = 'true';
			}, true );

			search.addEventListener( 'blur', function() {
				locationFilter.dataset.search = 'false';
			}, true );

		}
	},

	initialize : function() {
		this.dependencies.load();
	},

	update : function() {

	}

};

visu.initialize();
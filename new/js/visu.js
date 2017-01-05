var visu = {

	options : {
		element : 'visu',
		status : 'loading',
		category : 'c',
		subcategory : 'c',
		location : 'all',
		date : '2016-W6',
		level : 'region',
		periodicity : 'month'
	},

	dependencies : {
		list : [
			{
				name : 'Google Maps',
				type : 'script',      
				path : '//maps.googleapis.com/maps/api/js?key=AIzaSyBoqFIX7oEYftU-MW9H49ivEpYtU6BZJRs'
			},
			{
				name : 'Range Slider',
				type : 'script',      
				path : 'lib/rangeslider/js/script.js'
			},
			{
				name : 'Perfect Scroll',
				type : 'script',      
				path : 'lib/perfect-scroll/js/script.js'
			},
			{ 
				name : 'categories',
				type : 'json', 
				path : 'data/categories.json'
			},
			{
				name : 'states',
				type : 'json', 
				path : 'data/states.json'
			},
		],
		load : function() {

			var dependencies, requests, pending, script, json;

			dependecies = this.list;
			pending = dependecies.length;

			script = function( path, callback ) {

				var script;

				script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = path;
				document.body.appendChild( script );

				script.onload = function() {
					callback()
				}
			}

			json = function( path, callback ) {   

				var request;

				request = new XMLHttpRequest();
				request.overrideMimeType( 'application/json' );
				request.open( 'GET', path, true );

				request.onload = function () {
					if ( request.readyState == 4 && request.status == 200 )
						callback( request.responseText )
				}

				request.send();
			}

			each( dependecies, function( dependency ) {

				if ( dependency.type == 'json' ) {

					json( dependency.path, function( response ) {
						visu.data[ dependency.name ] = JSON.parse( response );
						--pending;
						if ( pending <= 0 ) visu.dependencies.callback()
					});

				} else if ( dependency.type == 'script' ) {

					script( dependency.path, function() {
						--pending;
						if ( pending <= 0 ) visu.dependencies.callback()
					});

				}
			});
		},
		callback : function() {
			console.log( 'requests done' );
			visu.interaction.initialize();
		}
	},

	get : {
		status : function() {},
		category : function() {},
		subcategory : function() {},
		location : function() {},
		date : function() {},
		totals : function() {},
 		current : {
 			category : function() {},
 			subcategory : function() {},
			location : function() {},
			date : function() {},
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
		status : function( value ) {
			visu.options.status = value;
		},
		category : function( value ) {
			visu.options.category = value;
		},
		subcategory : function( value ) {
			visu.options.subcategory = value;
		},
		location : function( value ) {
			visu.options.location = value;
		},
		date : function( value ) {
			visu.options.date = value;
		},
		level : function( value ) {
			visu.options.level = value;
		},
		periodicity : function( value ) {
			visu.options.periodicity = value;
		}
	},

	data : {},

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

		buttons : {
			initialize : function() {

				each( 'button-item' , function() {
					this.addEventListener( 'click', function() {

						if ( isActive( this ) ) {

							this.classList.remove( 'active' );
							visu.set[ this.name ]( this.value );

							console.log( visu.options );

						} else {

							group = closest( 'button-group', this );

							each( 'button', function() {
								this.classList.remove( 'active' );
							}, group );

							this.classList.add( 'active' );
							visu.set[ this.name ]( this.value );

						}
					});
				});
			}
		},

		search : {
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

		slider : {
			initialize : function() {

				var elements = document.querySelectorAll('[data-rangeSlider]');

		        rangeSlider.create( elements, {

		            onInit: function () {
		            },

		            onSlideStart: function ( value, percent, position ) {
		                console.info( 'onSlideStart', 'value: ' + value, 'percent: ' + percent, 'position: ' + position );
		            },

		            onSlide: function ( value, percent, position ) {
		                console.log( 'onSlide', 'value: ' + value, 'percent: ' + percent, 'position: ' + position );
		            },

		            onSlideEnd: function ( value, percent, position ) {
		                console.warn( 'onSlideEnd', 'value: ' + value, 'percent: ' + percent, 'position: ' + position );
		            }
		        });
			}
		},

		scroll : {
			initialize : function() {

				if ( !touch ) {
					Ps.initialize( the( 'scrollable' ), {
						suppressScrollX : true
					})
				}
			}
		}

		initialize : function() {

			this.buttons.initialize();
			this.search.initialize();
			this.slider.initialize();
			this.scroll.initialize();

		}
	},

	initialize : function() {
		this.dependencies.load();
	},

	update : function() {

	}

};

visu.initialize();
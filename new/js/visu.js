var map, visu

visu = {

	options : {
		element : 'visu',
		status : 'loading',
		category : 'c',
		subcategory : 'c',
		location : 'all',
		date : '2016-W6',
		level : 'region',
		periodicity : 'weekly'
	},

	defaults : {
		category : 'c',
		subcategory : 'c',
		location : 'all',
		level : 'region',
		periodicity : 'weekly'
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
				name : 'Perfect Scrollbar',
				type : 'script',      
				path : 'lib/perfect-scrollbar/js/script.js'
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
			visu.components.initialize();
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
			map : {
				initialize : function() {
					map = new google.maps.Map( the( 'map' ), {
						center: {
							lat : -15.174053,
							lng : -53.290964
						},
						zoom: 4,
						minZoom: 4,
						maxZoom: 12,
						styles: [{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"gamma":"0.00"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"lightness":"70"},{"gamma":"1.00"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#e1e2e9"},{"weight":"1"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#e1e2e9"},{"weight":"1"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"32"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"off"},{"lightness":"63"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ecedf1"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ecedf1"},{"weight":"1"}]}],
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						disableDefaultUI : true,
						// draggable: false
					});
				}
			}
		},
		ranking : {

		},
		related : {

		},
		initialize : function() {
			this.graphics.map.initialize();
		}
	},

	interaction : {

		buttons : {
			initialize : function() {

				each( 'button-item' , function() {

					var group;

					this.addEventListener( 'click', function() {

						if ( isActive( this ) ) {

							group = closest( 'button-group', this );

							each( 'button', function() {
								if ( this.value == visu.defaults[ this.name ] ) {
									this.classList.add( 'active' );
									visu.set[ this.name ]( this.value );
								} else {
									this.classList.remove( 'active' );
								}
							}, group );

							console.log( visu.options );

						} else {

							group = closest( 'button-group', this );

							each( 'button', function() {
								this.classList.remove( 'active' );
							}, group );

							this.classList.add( 'active' );
							visu.set[ this.name ]( this.value );

							console.log( visu.options );

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

				if ( !touch() ) {
					Ps.initialize( the( 'scrollable' ), {
						suppressScrollX : true
					})
				}
			}
		},

		map : {
			initialize : function() {

				google.maps.event.addDomListener( the( 'zoomInButton' ), 'click', function() {
					map.setZoom( map.getZoom() + 1 );
				});

				google.maps.event.addDomListener( the( 'zoomOutButton' ), 'click', function() {
					map.setZoom( map.getZoom() - 1 );
				});  

			}
		},

		initialize : function() {

			this.buttons.initialize();
			this.search.initialize();
			this.slider.initialize();
			this.scroll.initialize();
			this.map.initialize();

		}
	},

	initialize : function() {
		this.dependencies.load();
	},

	update : function() {

	}

};

visu.initialize();
var map, visu;

visu = {

	options : {
		element : 'visu',
		status : 'loading',
		category : 'c',
		subcategory : 'c',
		location : 'all',
		date : undefined,
		week : undefined,
		level : 'region',
		periodicity : 'weekly'
	},

	defaults : {
		category : 'c',
		subcategory : 'c',
		location : 'all',
		level : 'region',
		periodicity : 'weekly',
		year : 2016
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
				path : 'data/raw/categories.json'
			},
			{ 
				name : 'weeks',
				type : 'json', 
				path : 'data/weeks.json'
			},
			{
				name : 'country',
				type : 'json', 
				path : 'data/country.json'
			},
			{
				name : 'states',
				type : 'json', 
				path : 'data/states.json'
			},
			{
				name : 'cities',
				type : 'json', 
				path : 'data/cities.json'
			}
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
			visu.components.initialize();
			visu.interaction.initialize();
			visu.update();
		}
	},

	get : {
		status : function() {},
		category : function() {},
		subcategory : function() {},
		location : function() {},
		date : function() {
			return visu.options.date;
		},
		week : function() {
			return visu.options.week;
		},
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
		week : function( value ) {
			visu.options.week = value;
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
			time : {
				element : the( '.date.filter' ),
				initialize : function() {
					var week = visu.data.weeks[ 0 ];
					visu.set.date( week.start );
					visu.set.week( week.y + visu.defaults.year + '-W' + week.w );
				},
				update : function() {
					var elements = {
						full : the( 'full' ),
						week : the( 'week' )
					};
					each( visu.data.weeks, function( week ) {
						var date = visu.get.date();
						if ( week.start === date ) {
							elements.full.setAttribute( 'datetime', date );
							elements.full.innerHTML = format.date( date );
							elements.week.setAttribute( 'datetime', visu.get.week() );
							elements.week.innerHTML = 'Semana ' + week.w;
						}
					} )
				}
			},
			initialize : function() {
				this.time.initialize();
			},
			update : function() {
				this.time.update();
			}
		},
		description : {
			element : the( '.description' ),
			initialize : function() {
				// Você está vendo casos confirmados de microcefalia por zika em crianças nascidas até 20 de agosto de 2016
				// Você está vendo casos descartados de microcefalia por zika em crianças nascidas até 20 de agosto de 2016
				// Você está vendo casos em análise de microcefalia por zika em crianças nascidas até 20 de agosto de 2016

				// Você está vendo óbitos que tem relação confirmada com microcefalia por zika em crianças “nascidas” até 20 de agosto de 2016
				// Você está vendo óbitos que tem relação descartada com microcefalia por zika em crianças “nascidas” até 20 de agosto de 2016
				// Você está vendo óbitos que tem relação em análise com microcefalia por zika em crianças “nascidas” até 20 de agosto de 2016

				var paragraph = document.createElement( 'p' );
				this.element.appendChild( paragraph );
			},
			update : function() {
				var text = 'Você está vendo ';
				if ( visu.options.category === 'c' ) {
					text += 'casos ';
					if ( visu.options.subcategory === 'c' ) text += 'confirmados ';
					if ( visu.options.subcategory === 'd' ) text += 'descartados ';
					if ( visu.options.subcategory === 'i' ) text += 'em análise ';
					text += 'de microcefalia <strong>por zika</strong> em crianças nascidas até ';
				}
				if ( visu.options.category === 'o' ) {
					text += 'óbitos que tem relação ';
					if ( visu.options.subcategory === 'c' ) text += 'confirmada ';
					if ( visu.options.subcategory === 'd' ) text += 'descartada ';
					if ( visu.options.subcategory === 'i' ) text += 'em análise ';
					text += 'com microcefalia <strong>por zika</strong> em crianças “nascidas” até ';
				}
				text += format.date( visu.get.date() );
				the( 'p', this.element ).innerHTML = text;
			}
		},
		graphics : {
			unique : {
				element : the( '.cases.new' ),
				bars : {
					element : the( '.cases.new .graphic' ),
					initialize : function() {
						var peak = 0;
						each( visu.data.country.c, function( object, index ) {
							if ( index > 0 )
								peak = this.u.cc > peak ? this.u.cc : peak;
						} );
						peak = Math.ceil( peak / 40 ) * 40;
						each( visu.data.country.c, function( object, index ) {

							var bar = document.createElement( 'div' );
							bar.classList.add( 'tooltip-container', 'bar' );
							bar.dataset.week = object.y + visu.defaults.year + '-W' + object.w;
							if ( index === 0 ) {
								bar.style.height = '0%';
							}
							var fill = document.createElement( 'div' );
							fill.classList.add( 'fill' );
							fill.style.height = this.u.cc * 100 / peak + '%';

							var info = document.createElement( 'div' );
							info.classList.add( 'tooltip' );

							var time = document.createElement( 'time' );
							time.setAttribute( 'datetime', ( this.y + visu.defaults.year ) + '-W' + this.w );
							time.innerHTML = 'Semana ' + this.w;

							var amount = document.createElement( 'div' );

							var output = document.createElement( 'output' );
							output.innerHTML = this.u.cc;

							var label = document.createElement( 'span' );
							label.innerHTML = ' casos';

							amount.appendChild( output );
							amount.appendChild( label );
							info.appendChild( time );
							info.appendChild( amount );
							fill.appendChild( info );
							bar.appendChild( fill );

							visu.components.graphics.unique.bars.element.appendChild( bar );

						} );
					},
					update : function() {
						each( '.bar', function() {
							var current = decode.week( this.dataset.week );
							var target = decode.week( visu.get.week() );
							if ( current.y <= target.y && current.w <= target.w ) {
								this.classList.remove( 'disabled' );
							} else {
								this.classList.add( 'disabled' );
							}
						}, this.element );
					}
				},
				scale : {
					amount : {
						element : the( '.cases.new .scale.amount' ),
						initialize : function() {
							var peak = 0;
							each( visu.data.country.c, function( object, index ) {
								if ( index > 0 )
									peak = this.u.cc > peak ? this.u.cc : peak;
							} );
							peak = Math.ceil( peak / 40 ) * 40;
							var increment = peak / 4;
							each( 'span', function( index ) {
								this.innerHTML = increment * ( index + 1 );
							}, this.element );
						}
					},
					initialize : function() {
						this.amount.initialize();
					}
				},
				initialize : function() {
					this.bars.initialize();
					this.scale.initialize();
				},
				update : function() {
					this.bars.update();
				}
			},
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
						scrollwheel: false,
						// draggable: false
					});
				}
			}
		},
		ranking : {
			element : the( '.ranking' ),
			sort : function( category ) {

				var category = category || visu.defaults.category + visu.defaults.subcategory;

				function compare( a, b ) {
					var a = a.c[ a.c.length - 1 ];
					var b = b.c[ b.c.length - 1 ];

					a = a.hasOwnProperty( category ) ? a[ category ] : 0;
					b = b.hasOwnProperty( category ) ? b[ category ] : 0;
					return b - a;
				}

				visu.data.cities.sort( compare );

			},
			total : function() {

				var total = 0;
				var text = 'tem casos confirmados';

				each( visu.data.cities, function() {
					var week = this.c[ this.c.length - 1 ];
					total += week.hasOwnProperty( 'cc' ) ? week.cc : 0;
				} );

				if ( total > 1 )
					text = 'têm casos confirmados';

				if ( total === visu.data.cities.length )
					total = 'Todos';
				else if ( total === 0 )
					total = 'Nenhum';
				else
					total = thousands( total );

				text = '&nbsp' + text;

				var output = document.createElement( 'output' );
				output.innerHTML = total;

				var caption = document.createElement( 'span' );
				caption.innerHTML = text;

				the( '.amount p', this.element ).appendChild( output );
				the( '.amount p', this.element ).appendChild( caption );

			},
			initialize : function() {

				var table = the( '.table', this.element );

				this.sort();

				this.total();

				var cities = visu.data.cities;

				for ( var i = 0; i < 5; i++ ) {

					city = cities[ i ];

					var item = document.createElement( 'li' );
					var position = document.createElement( 'span' );
					var location = document.createElement( 'span' );
					var totals = document.createElement( 'div' );
					var initials = document.createElement( 'span' );

					position.classList.add( 'position' );
					position.innerHTML = i + 1;

					location.classList.add( 'location' );
					location.innerHTML = city.n;

					initials.classList.add( 'initials' );
					initials.innerHTML = '&nbsp;' + city.s;

					totals.classList.add( 'totals' );

					for ( var j = 0; j < 3; j++ ) {

						var subcategories = [ 'c', 'd', 'i' ];
						var category = visu.defaults.category + subcategories[ j ];

						var output = document.createElement( 'output' );
						var cases = city.c[ city.c.length- 1 ][ category ] || 0;
						output.innerHTML = thousands( cases );

						totals.appendChild( output );

					}

					location.appendChild( initials );
					item.appendChild( position );
					item.appendChild( location );
					item.appendChild( totals );
					table.appendChild( item );

				}
			},
			update : function() {

			}
		},
		related : {

		},
		initialize : function() {
			this.filters.initialize();
			this.description.initialize();
			this.graphics.map.initialize();
			this.graphics.unique.initialize();
			this.ranking.initialize();
		},
		update : function() {
			this.filters.update();
			this.description.update();
			this.graphics.unique.update();
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

						} else {

							group = closest( 'button-group', this );

							each( 'button', function() {
								this.classList.remove( 'active' );
							}, group );

							this.classList.add( 'active' );
							visu.set[ this.name ]( this.value );

						}

						visu.update();
						console.log( visu.options );

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
			element : the( '[data-rangeSlider]' ),
			min : 0,
			max : undefined,
			initialize : function() {

				this.max = visu.data.weeks.length - 1;

				this.element.setAttribute( 'min', this.min );
				this.element.setAttribute( 'max', this.max );
				this.element.setAttribute( 'value', 0 );

		        rangeSlider.create( this.element, {

		            onInit: function () {
		            },

		            onSlideStart: function ( value, percent, position ) {
		            	visu.interaction.slider.update( value );
		            },

		            onSlide: function ( value, percent, position ) {
		            	visu.interaction.slider.update( value );
		            },

		            onSlideEnd: function ( value, percent, position ) {
		            	visu.interaction.slider.update( value );
		            }
		        });
			},
			update : function( index ) {
				var object = visu.data.weeks[ index ];
				var date = object.start;
				var week = visu.defaults.year + object.y + '-W' + object.w;
				if ( visu.get.date() !== date ) {
					visu.set.date( date );
					visu.set.week( week );
					visu.update();
				}
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
		this.components.update();
	}

};

visu.initialize();
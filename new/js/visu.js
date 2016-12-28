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
				name : 'categories',
				type : 'json', 
				path : 'data/categories.json'
			},
			{
				name : 'states',
				type : 'json', 
				path : 'data/states.json'
			}
		],
		load : function() {

			var dependencies, requests, counter, script, json;

			dependecies = this.list;
			counter = dependecies.length;

			script = function( path ) {

				var script;

				script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = path;
				document.body.appendChild( script );
			}

			json = function( path, callback ) {   

				var request;

				request = new XMLHttpRequest();
				request.overrideMimeType( 'application/json' );
				request.open( 'GET', path, true );

				request.onreadystatechange = function () {
					if ( request.readyState == 4 && request.status == 200 ) {
						callback( request.responseText );
					}
				}

				request.send();

			}

			each( dependecies, function( dependency ) {

				if ( dependency.type == 'json' ) {

					json( dependency.path, function( response ) {

						visu.data[ dependency.name ] = JSON.parse( response );

						--counter;

						if ( counter <= 0 ) {
							visu.dependencies.callback()
						}

					});

				} else if ( dependency.type == 'script' ) {

				}

			});
		},
		callback : function() {

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
		initialize : function() {

			search = the( 'search' );
			locationFilter = the( 'location filter' );

			search.addEventListener( 'focus', function() {
				locationFilter.dataset.search = 'true';
			}, true );

			search.addEventListener( 'blur', function() {
				locationFilter.dataset.search = 'false';
			}, true );


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

						console.log( visu.options );

					}
				});
			});
		}
	},

	initialize : function() {
		this.dependencies.load();
	},

	update : function() {

	}

};

visu.initialize();

/* 


$.ajax
$.when.apply( a, b, ).then( c );

carregar : {
script : function( dependencia ) {
  script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.src = dependencia.url;
  document.body.appendChild( script );
},
json : function( dependencia ) {
  vis.dados.requisicoes.push(
    $.ajax({
      dataType : dependencia.tipo,
      url : dependencia.url,
      success: function() {
      }
    })
  );
}
},


vis.dados.requisicoes = [];
for ( var i = 0; i < vis.dependencias.length; i++ ) {
  dependencia = vis.dependencias[ i ];
  tipo = dependencia.tipo;
  this.carregar[ tipo ]( dependencia );
}
$.when.apply( undefined, vis.dados.requisicoes ).then( function() {
  for ( var i = 0, j = 0; i < vis.dependencias.length; i++ ) {
    dependencia = vis.dependencias[ i ];
    if ( dependencia.tipo != 'script' ) {
      requisicao  = vis.dados.requisicoes[ j ];
      variavel    = dependencia.nome;
      json        = requisicao.responseJSON;
      vis.dados[ variavel ] = json;
      j++
    }
  }
  delete vis.dados.requisicoes;

  */
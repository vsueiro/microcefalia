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
			console.log( 'add interaction' );
		}
	},

	initialize : function() {
		this.dependencies.load();
	},

	update : function() {

	}

};

visu.initialize();
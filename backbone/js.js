
var User = Backbone.Model.extend({
	defaults: {
		name: 'Name',
		desc: '<b>desc</b>',
	},
	url: './data.json',
	initialize: function() {
	},
	validate: function(attrs) {
		if ( ! attrs.phone) {
			return 'The phone is required';
		}
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'user': 'user',
		'user/:id': 'userView',
	},
	user: function() {
		alert('user');
	},
	userView: function(id) {
		alert('userView: '+id);
	}
})

var user = new User();
var router = new Router;;
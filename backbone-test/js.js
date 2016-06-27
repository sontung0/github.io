
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
		'users': 'users',
		'user/:id': 'userView',
	},
    execute: function(callback, args, name) {
        console.log([callback, args, name]);

        if (name != 'users') {
            this.navigate('users', {trigger: true});

            return false;
        }
    },
	users: function() {
		alert('users');
	},
	userView: function(id) {
		alert('userView: '+id);
	}
})

var user = new User();
var router = new Router;

$(function() {
	Backbone.history.start();
});
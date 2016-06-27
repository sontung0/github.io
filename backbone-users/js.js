var User = Backbone.Model.extend({});

var Users = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage('backbone-users'),
});

var UserView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#user-template').html()),

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
});

var AppView = Backbone.View.extend({
    el: '#app',
    data: {users: null},

    initialize: function(data) {
        this.data = data;
        this.listenTo(this.data.users, 'add', this.addUser);
    },

    addUser: function(user) {
        var userView = new UserView({model: user});
        this.$('#users').append(userView.render().$el);
    },
});

var users = new Users;
var appView = new AppView({
    users: users,
});

users.create({
    name: 'Name',
    phone: '123',
});
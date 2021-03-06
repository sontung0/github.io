var User = Backbone.Model.extend({
    validate: function(attrs) {
        if ( ! attrs.name) return 'The name is required';
        if ( ! attrs.phone) return 'The phone is required';
    },
});

var Users = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage('backbone-users'),
});

var UserView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#user-template').html()),
    events: {
        'click .act-delete': 'deleteUser',
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html(this.template({user: this.model}));
        return this;
    },

    deleteUser: function(e) {
        e.preventDefault();
        this.model.destroy();
    },
});

var UsersView = Backbone.View.extend({
    template: _.template($('#users-template').html()),
    data: {
        users: null,
        router: null,
    },

    initialize: function(data) {
        _.extend(this.data, data);
        this.listenTo(this.data.users, 'add', this.addUser);
        this.render();
        this.data.users.fetch();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    addUser: function(user) {
        var userView = new UserView({model: user});
        this.$('#users').append(userView.render().$el);
    },
});

var UserFormView = Backbone.View.extend({
    template: _.template($('#user-form-template').html()),
    events: {
        'submit form': 'submit',
    },
    data: {
        user: new User,
        users: null,
        router: null,
    },

    initialize: function(data) {
        _.extend(this.data, data);
        this.addUser();
    },

    render: function() {
        this.$el.html(this.template(this.data));
        return this;
    },

    addUser: function() {
        this.data.user = new User;
        return this.render();
    },

    editUser: function(userId) {
        this.data.user = this.data.users.get(userId);
        return this.render();
    },

    submit: function(e) {
        e.preventDefault();

        var user = new User({
            name: this.$('[name=name]').val(),
            phone: this.$('[name=phone]').val(),
        });

        if ( ! user.isValid()) {
            this.$('[data-param=error]').html(user.validationError).show();
            return;
        }

        if (this.data.user.isNew()) {
            this.data.users.create(user.attributes);
        } else {
            this.data.user.save(user.attributes);
        }

        this.$('[data-param=error]').html('').hide();
        this.data.router.navigate('list', {trigger: true, replace: true});
    },
});

var Router = Backbone.Router.extend({
    routes: {
        'list': 'listUsers',
        'add': 'addUser',
        'edit/:id': 'editUser',
    },
    data: {
        app: null,
        usersView: null,
        userFormView: null,
    },

    initialize: function() {
        var args = {
            router: this,
            users: new Users,
        };

        this.data.app = $('#app');
        this.data.usersView = new UsersView(args);
        this.data.userFormView = new UserFormView(args);

        this.data.app.append(this.data.usersView.$el);
        this.data.app.append(this.data.userFormView.$el);

        this.listUsers();
    },

    listUsers: function() {
        this.data.usersView.$el.show();
        this.data.userFormView.$el.hide();
    },

    addUser: function() {
        this.data.usersView.$el.hide();
        this.data.userFormView.addUser().$el.show();
    },

    editUser: function(userId) {
        this.data.usersView.$el.hide();
        this.data.userFormView.editUser(userId).$el.show();
    },
});

$(function() {
    var router = new Router;
    Backbone.history.start();
});
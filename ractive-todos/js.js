
var FormAdd = Ractive.extend({
	template: '#form-add-template',
	data: {
		desc: '',
		selectAll: false,
	},
	formSubmit: function(event) {
		event.original.preventDefault();

		if ( ! this.get('desc')) return;

		this.fire('addItem', {
            desc: this.get('desc'),
            completed: false,
        });

		this.set('desc', '');
	},
	toggleAll: function(event) {
		event.original.preventDefault();

		this.toggle('selectAll');
		this.fire('toggleAll', this.get('selectAll'));
	},
});;

var Items = Ractive.extend({
    template: '#items-template',
    data: {
        items: [],
        itemEditing: {i: null, desc: null},
        filters: {all: 'All', active: 'Active', completed: 'Completed'},
        currentFilter: 'all',
        count: function (filter) {
            return this.filterItems(filter).length;
        },
    },
    computed: {
        itemsResult: function () {
            return this.filterItems(this.get('currentFilter'));
        },
    },
    editItem: function (event, i) {
        event.original.preventDefault();

        this.set('itemEditing', {
            i: i,
            desc: this.get('items.'+i+'.desc'),
        });
    },
    submitEditItem: function (event) {
        event.original.preventDefault();

        var editing = this.get('itemEditing');

        if ( ! editing.desc) return;

        this.set('items.'+editing.i+'.desc', editing.desc);
        this.set('itemEditing', {i: null, desc: null});
    },
    cancelEditItem: function (event) {
        event.original.preventDefault();

        this.set('itemEditing', {i: null, desc: null});
    },
    removeItem: function (event, i) {
        event.original.preventDefault();

        this.splice('items', i, 1);
    },
    toggleStatusItem: function (event, i) {
        event.original.preventDefault();

        this.toggle('items.'+i+'.completed');
    },
    clearCompletedItems: function(event) {
        event.original.preventDefault();

        this.set('items', this.filterItems('active'));
    },
    filterItems: function(filter) {
        return this.get('items').filter(function(item) {
            if (filter == 'active') return ! item.completed;
            if (filter == 'completed') return item.completed;
            return true;
        });
    },
})

var todos = new Ractive({
	el: '#todos',
	template: '#todos-template',
	components: {
		formAdd: FormAdd,
		items: Items,
	},
	data: {
        items: [
            {desc: 'Add a todo', completed: false},
            {desc: 'Add some more todos', completed: true},
            {desc: 'Build something with Ractive.js', completed: false},
        ],
    },
});

todos.on({
	addItem: function(item) {
		this.push('items', item);
	},
	toggleAll: function(status) {
		this.set('items.*.completed', status);
	},
});

todos.observe('items', function (newValue, oldValue, keypath) {
    this.set('items', newValue.map(function (item, id) {
        item.id = id;

        return item;
    }));
});
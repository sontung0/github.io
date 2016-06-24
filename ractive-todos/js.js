
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
});

var Items = Ractive.extend({
    template: '#items-template',
    data: {
        items: [],
        itemEditing: {i: null, desc: null},
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
})

var todos = new Ractive({
	el: '#todos',
	template: '#todos-template',
	components: {
		formAdd: FormAdd,
		items: Items,
	},
	data: {items: [
        {desc: 'aaaaaaaa'},
        {desc: 'bbbbbbbb'},
    ]},
});

todos.on({
	addItem: function(item) {
		this.push('items', item);
	},
	toggleAll: function(status) {
		this.set('items.*.completed', status);
	},
});
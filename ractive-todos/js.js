
var FormAdd = Ractive.extend({
	template: '#form-add-template',
	data: {
		item: '',
		selectAll: false,
	},
	submit: function(event) {
		event.original.preventDefault();

		if ( ! this.get('item')) return;

		this.fire('addItem', this.get('item'));
		this.set('item', '');
	},
	toggleAll: function(event) {
		event.original.preventDefault();

		this.toggle('selectAll');
		this.fire('toggleAll', this.get('selectAll'));
	},
});

var todos = new Ractive({
	el: '#todos',
	template: '#todos-template',
	components: {
		formAdd: FormAdd,
	},
	data: {
		items: [],
	},
});

todos.on({
	addItem: function(item) {
		this.push('items', {item: item});
		console.log(this.get('items'));
	},
	toggleAll: function(status) {
		console.log(status);
	},
});
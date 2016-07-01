draw('Chart bar', getData());

function getData() {
	var colors = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'];

	return d3.range(1, 11).map(function(gi) {
		var items = colors.map(function(color, i) {
			return {
				item: 'Item ' + i,
				value: _.random(10, 100),
				color: color
			};
		});

		return {
			group: 'G' + gi,
			items: items
		};
	});
}

function draw(title, data) {
	var svgWidth = window.innerWidth * 0.7;
	var svgHeight = 600;
	var margin = {top: 20, right: 50, bottom: 20, left: 150};
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width])
		.domain([0, getItemValueMax()]);

	var y0 = d3.scale.ordinal()
		.rangeRoundBands([height, 0], .1)
		.domain(_.pluck(data, 'group'));

	var y1 = d3.scale.ordinal()
		.rangeRoundBands([0, y0.rangeBand()])
		.domain(_.pluck(_.first(data).items, 'item').reverse());

	var yGroupLabel = d3.scale.ordinal()
		.rangeRoundBands([0, y0.rangeBand()])
		.domain([1, 2]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')
		.tickFormat(d3.format('.2s'));

	var yAxis = d3.svg.axis()
		.scale(y0)
		.orient('left');

	var svg = makeSvg();

	drawAxis();
	drawBars();

	function makeSvg() {
		return d3.select('#chart').append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.attr('class', 'chart-bar-horizonal')
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	}

	function drawAxis() {
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis)
			.selectAll('.tick line')
			.attr('y1', 5)
			.attr('y2', function(d) {
				return -height;
			});

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.selectAll('.tick text')
			.attr('x', function(d) {
				var group = _.findWhere(data, {group: d});
				var xs = group.items.map(function(item) {
					return x(item.value)
				});

				return d3.max(xs);
			})
			.style('text-anchor', 'start')
			.attr('dx', '0.5em')
			.text(function(d) {
				var group = _.findWhere(data, {group: d});

				return group.group + ' ' + _.pluck(group.items, 'value').join(',');
			});
	}

	function drawBars() {
		var group = svg.selectAll('.group')
			.data(data)
			.enter().append('g')
			.attr('class', 'group')
			.attr('transform', function(d) {
				return 'translate(0, ' + y0(d.group) + ')';
			});

		group.selectAll('rect')
			.data(function(d) {
				return d.items;
			})
			.enter().append('rect')
			.attr('width', function(d) {
				return x(d.value);
			})
			.attr('height', y1.rangeBand())
			.attr('x', 0)
			.attr('y', function(d) {
				return y1(d.item);
			})
			.style('fill', function(d) {
				return d.color;
			});
	}

	function getItemValueMax() {
		return d3.max(data, function(group) {
			return d3.max(group.items, function(item) {
				return item.value;
			});
		});
	}
}
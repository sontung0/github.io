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
	var svgHeight = 500;
	var margin = {top: 50, right: 20, bottom: 150, left: 40};
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1)
		.domain(_.pluck(data, 'group'));

	var x1 = d3.scale.ordinal()
		.rangeRoundBands([0, x0.rangeBand()])
		.domain(_.pluck(_.first(data).items, 'item'));

	var xGroupLabel = d3.scale.ordinal()
		.rangeRoundBands([0, x0.rangeBand()])
		.domain([1, 2]);

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, getItemValueMax()]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient('bottom');

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')
		.tickFormat(d3.format('.2s'));

	var svg = makeSvg();

	drawTitle();
	drawAxis();
	drawBars();
	drawListGroups('top');
	drawListGroups('bottom');
	drawListGroups('left');
	drawListGroups('right');

	function makeSvg() {
		return d3.select('#chart').append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	}

	function drawAxis() {
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis)
			.selectAll('.tick text')
			.attr({transform: 'rotate(90)', x: 10, y: 0, dy: '.5em'})
			.style('text-anchor', 'start')
			.text(function(d) {
				var group = _.findWhere(data, {group: d});

				return group.group + ' ' + _.pluck(group.items, 'value').join(',');
			});

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.selectAll('.tick line')
			.attr('x1', -5)
			.attr('x2', function(d) {
				return d ? width : 0
			});
	}

	function drawBars() {
		var group = svg.selectAll('.group')
			.data(data)
			.enter().append('g')
			.attr('class', 'group')
			.attr('transform', function(d) {
				return 'translate(' + x0(d.group) + ',0)';
			});

		group.selectAll('rect')
			.data(function(d) {
				return d.items;
			})
			.enter().append('rect')
			.attr('width', x1.rangeBand())
			.attr('x', function(d) {
				return x1(d.item);
			})
			.attr('y', function(d) {
				return y(d.value);
			})
			.attr('height', function(d) {
				return height - y(d.value);
			})
			.style('fill', function(d) {
				return d.color;
			});

		group.append('text')
			.attr('x', xGroupLabel(2))
			.attr('y', function(d) {
				var ys = d.items.map(function(item) {
					return y(item.value)
				});
				return d3.min(ys);
			})
			.attr('dy', '-2.5em')
			.style('text-anchor', 'middle')
			.text(function(d) {
				return d.group
			});

		group.append('text')
			.attr('x', xGroupLabel(2))
			.attr('y', function(d) {
				var ys = d.items.map(function(item) {
					return y(item.value)
				});
				return d3.min(ys);
			})
			.attr('dy', '-1em')
			.style('text-anchor', 'middle')
			.text(function(d) {
				return _.pluck(d.items, 'value');
			});
	}

	function drawListGroups(location) {
		var items = _.first(data).items;

		d3.select('#chart-bar-groups-' + location).html(function() {
			var html = '<div class="list-groups">';
			items.forEach(function(item) {
				html += '<div class="group-item">'
					+ '<span class="group-item-color" style="background-color:' + item.color + ';"></span>'
					+ '<span class="group-item-label">' + item.item + '</span>'
					+ '</div>';
			});
			html += '</div>';

			return html;
		});
	}

	function drawTitle() {
		d3.select('#chart-bar-title').html(title);
	}

	function getItemValueMax() {
		return d3.max(data, function(group) {
			return d3.max(group.items, function(item) {
				return item.value;
			});
		});
	}
}
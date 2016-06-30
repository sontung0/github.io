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
	var svgHeight = 700;
	var margin = {top: 50, right: 20, bottom: 20, left: 150};
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	var y0 = d3.scale.ordinal()
		.rangeRoundBands([0, height], .1)
		.domain(_.pluck(data, 'group'));

	var y1 = d3.scale.ordinal()
		.rangeRoundBands([0, y0.rangeBand()])
		.domain(_.pluck(_.first(data).items, 'item'));

	var yGroupLabel = d3.scale.ordinal()
		.rangeRoundBands([0, y0.rangeBand()])
		.domain([1, 2]);

	var x = d3.scale.linear()
		.range([0, width])
		.domain([0, getItemValueMax()]);

	var yAxis = d3.svg.axis()
		.scale(y0)
		.orient('left');

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')
		.tickFormat(d3.format('.2s'));

	var svg = makeSvg();

	drawTitle();
	drawAxis();
	drawBars();
	//drawListGroups('top');
	//drawListGroups('bottom');
	//drawListGroups('left');
	//drawListGroups('right');

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
			.call(xAxis);

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.selectAll('.tick text')
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
			.attr('height', y1.rangeBand())
			.attr('width', function(d) {
				return x(d.value);
			})
			.attr('x', 0)
			.attr('y', function(d) {
				return y1(d.item);
			})
			.style('fill', function(d) {
				return d.color;
			});

		//group.append('text')
		//	.attr('x', function(d) {
		//		var xs = d.items.map(function(item) {
		//			return x(item.value)
		//		});
		//		return d3.min(xs);
		//	})
		//	.attr('x', xGroupLabel(2))
		//	.attr('dy', '-2.5em')
		//	.style('text-anchor', 'middle')
		//	.text(function(d) {
		//		return d.group
		//	});
		//
		//group.append('text')
		//	.attr('x', xGroupLabel(2))
		//	.attr('y', function(d) {
		//		var ys = d.items.map(function(item) {
		//			return y(item.value)
		//		});
		//		return d3.min(ys);
		//	})
		//	.attr('dy', '-1em')
		//	.style('text-anchor', 'middle')
		//	.text(function(d) {
		//		return _.pluck(d.items, 'value');
		//	});
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
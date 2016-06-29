
draw(getData());

function getData() {
    var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];

    return d3.range(1, 11).map(function(gi) {
        var items = colors.map(function(color, i) {
            return {
                item: 'Item '+i,
                value: _.random(10, 100),
                color: color,
            };
        });

        return {
            group: 'G'+gi,
            items: items,
        };
    });
}

function draw(data) {
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(_.pluck(data, 'group'));

    var x1 = d3.scale.ordinal()
        .rangeRoundBands([0, x0.rangeBand()])
        .domain(_.pluck(_.first(data).items, 'item'));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, getValueMax(data)]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('.tick text')
        .attr({transform: 'rotate(90)', x: 10, y: 0, dy: '.5em'})
        .text(function(d) {
            var group = _.findWhere(data, {group: d});
            return group.group+' '+ _.pluck(group.items, 'value').join(',');
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d.group) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.items; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.item); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return d.color; });
}

function getValueMax(data) {
    return d3.max(data, function(group) {
        return d3.max(group.items, function(item) {
            return item.value;
        })
    });
}
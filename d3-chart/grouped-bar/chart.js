
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
    var svgWidth = window.innerWidth-30;
    var svgHeight = 1400;
    var width = 800;
    var height = 400;
    var margin = {
        top: 300,
        bottom: 50,
        left: (svgWidth-width)/2,
        right: this.left,
    };

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
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#chart-bars").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('.tick text')
        .attr({transform: 'rotate(90)', x: 10, y: 0, dy: '.5em'})
        .style('text-anchor', 'start')
        .text(function(d) {
            var group = _.findWhere(data, {group: d});
            return group.group+' '+ _.pluck(group.items, 'value').join(',');
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('.tick line')
        .attr('x2', function(d) { return d ? width : 0 });

    var group = svg.selectAll(".group")
        .data(data)
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function(d) { return "translate(" + x0(d.group) + ",0)"; });

    group.selectAll("rect")
        .data(function(d) { return d.items; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.item); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return d.color; });

    group.append("text")
        .attr("x", xGroupLabel(2))
        .attr("y", function(d) {
            var ys = d.items.map(function(item) { return y(item.value) });
            return d3.min(ys);
        })
        .attr("dy", '-2.5em')
        .style("text-anchor", "middle")
        .text(function(d) {return d.group });

    group.append("text")
        .attr("x", xGroupLabel(2))
        .attr("y", function(d) {
            var ys = d.items.map(function(item) { return y(item.value) });
            return d3.min(ys);
        })
        .attr("dy", '-1em')
        .style("text-anchor", "middle")
        .text(function(d) {
            return _.pluck(d.items, 'value');
        });

    drawListGroups('top');
    drawListGroups('bottom');
    drawListGroups('left');
    drawListGroups('right');

    function drawListGroups(location) {
        var groupsVerticalWidth = (svgWidth-width)/2;
        var groupsVerticalHeight = svgHeight-margin.top;
        var groupsHorizontalWidth = width;
        var groupsHorizontalHeight = 200;
        var items = _.first(data).items;

        var foreignObject = svg.append("foreignObject");

        switch (location) {
            case 'top': {
                foreignObject.attr("transform", "translate(0,-" + (groupsHorizontalHeight+20) + ")")
                    .attr("width", groupsHorizontalWidth)
                    .attr("height", groupsHorizontalHeight);
                break;
            }
            case 'bottom': {
                foreignObject.attr("transform", "translate(0," + (height+150) + ")")
                    .attr("width", groupsHorizontalWidth)
                    .attr("height", groupsHorizontalHeight);
                break;
            }
            case 'left': {
                foreignObject.attr("transform", "translate(-" + groupsVerticalWidth + ",0)")
                    .attr("width", groupsVerticalWidth)
                    .attr("height", groupsVerticalHeight);
                break;
            }
            case 'right': {
                foreignObject.attr("transform", "translate(" + width + ",0)")
                    .attr("width", groupsVerticalWidth)
                    .attr("height", groupsVerticalHeight);
                break;
            }
        }

        foreignObject.append('xhtml:div')
            .attr("class", "list-groups list-groups-"+location)
            .html(function() {
                var html = '';
                items.forEach(function(item) {
                    html += '<div class="group-item">'
                        +'<span class="group-item-color" style="background-color:'+item.color+';"></span>'
                        +'<span class="group-item-label">'+item.item+'</span>'
                        +'</div>';
                });

                return html;
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
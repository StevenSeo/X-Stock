var ezStockApp = angular.module('ezStockApp');

ezStockApp.directive('nvdLineChart', function() {
  return {
	restrict: 'AE',
	
	scope: {
		val: '=',
		width: '=',
		height: '=',
		stb: '=',
		lastprice: '@',
		
	},
    link: function (scope, element, attrs) {

					chart = nv.models.lineChart()
						.options({
							transitionDuration: 300,
							useInteractiveGuideline: true
						})
					;

					// chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
					chart.xAxis
						.axisLabel('')                                                
						//.tickFormat(function(d) { return d3.time.format('%I:%M')(new Date(d));})
                                                .tickFormat(function(d) { return d3.time.format('%Y/%m/%d')(new Date(d));})
						.staggerLabels(true)
					;

					chart.yAxis
						.axisLabel('')
						.tickFormat(d3.format(',.2f'))
					;
					
		var vis = d3.select(element[0])
			.append("svg")
			.attr("width", scope.width)
			.attr("height", scope.height)
			.datum([]);						
			
	console.log(scope.stb);
			scope.$watch('val', function (newValue, oldValue) {
				if (newValue) {
					var min = d3.min(newValue, function (d) { return parseFloat(d.y); });
					var max = d3.max(newValue, function (d) { return parseFloat(d.y); });
					//chart.forceY([min - min*0.0005, max + max*0.0005]);
                                        chart.forceY([min - min*0.05, max + max*0.05]);
				
				
					vis.datum([
							{
								area: true,
								values: newValue,
								key: "Standard",
								color: scope.color
							}
							/*,{
								
								values: [{"x":"1431696621","y":"110"},{"x":"1431719945","y":"110"}],
								key: "Layer1",
								color: "#2ca02c"
							}*/
					]) 
					.call(chart);		

						vis.select("g")
							.append("line")
							.style("stroke", "red")
							.style("stroke-width", "1px")
							.style("stroke-dasharray", ("3, 3"))
							.attr("x1", 0)
							.attr("y1", chart.yAxis.scale()(scope.lastprice))
							.attr("x2", 920)
							.attr("y2", chart.yAxis.scale()(scope.lastprice));

		
						nv.utils.windowResize(chart.update);						
				}
				
			});
			
			
	}
  };
});

ezStockApp.directive('nvdPieChart', function() {
  return {
	restrict: 'AE',
	
	scope: {
		val: '=',
		width: '=',
		height: '='
	},
    link: function (scope, element, attrs) {	
			
			var vis = d3.select(element[0])
			.append("svg")
			.attr("width", scope.width)
			.attr("height", scope.height)
			.datum([]);
	
			scope.$watch('val', function (newValue, oldValue) {
				if (newValue) {
					var chart = nv.models.pieChart()
					  .x(function(d) { return d.symbol })
					  .y(function(d) { return d.lastprice*d.qty })
					  .showLabels(true);

					vis
						.datum(newValue)
						.transition().duration(350)
						.call(chart);
						
					nv.utils.windowResize(chart.update);
				}				
			});
			
			
	}
  };
});


ezStockApp.directive('nvdBarChart', function() {
  return {
	restrict: 'AE',
	
	scope: {
		val: '=',
		width: '=',
		height: '='
	},
    link: function (scope, element, attrs) {	
			
			var vis = d3.select(element[0])
			.append("svg")
			.attr("width", scope.width)
			.attr("height", scope.height)
			.datum([]);
	
			scope.$watch('val', function (newValue, oldValue) {
				if (newValue) {
					var chart = nv.models.discreteBarChart()
					.x(function(d) { return d.symbol })
					.y(function(d) { return d.gainloss })
					.staggerLabels(true)
					.tooltips(false)
					.showValues(true)
					.color(function(d) { return (d.gainloss > 0) ? "#2ca02c" : "#ff0000" });
					
					data = [{key: "", values: newValue, color:"#d62728"}];

					vis
						.datum(data)
						.call(chart);
						
					nv.utils.windowResize(chart.update);
				}				
			});
			
			
	}
  };
});
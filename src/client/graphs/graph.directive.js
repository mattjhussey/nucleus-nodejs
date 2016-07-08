(function() {
  'use strict';
  module.exports = directive;

  var template = require('./graph.html');

  /**
   * Directive builder function.
   *
   * @param {Object} graphService - The service to provide the graph data.
   * @returns {object} Directive definition Object.
   */
  function directive(graphService) {
    return {
      link: link,
      restrict: 'E',
      scope: {
        selected: '@selected'
      },
      template: template
    };

    /**
     * Run display setup tasks.
     *
     * @param {object} $scope - The data scope to work with.
     * @param {object} $element - The html element the directive applies to.
     */
    function link($scope, $element) {
      var svg;
      var xAxis;
      var yAxis;

      setup();
      $scope.$watch('selected', onSelectedUpdated);

      /**
       * Refresh the UI with the new data.
       *
       * @param {Object} lineData - The new line data to populate with.
       */
      function refreshData(lineData) {
        var dimensions;

        dimensions = calculateDimensions();
        configureAxes();
        configureLines();

        /**
         * Work out the dimensions available.
         *
         * @returns {Object} Object containing size, scale, min, max, etc.
         */
        function calculateDimensions() {
          var height;
          var margin = 60;
          var maximumX = new Date(0);
          var maximumY = 0;
          var minimumX = new Date(2100, 1, 1);
          var width;
          var xScale;
          var yScale;

          lineData.forEach(function(line) {
            line.data.forEach(function(coords) {
              maximumX = coords.date > maximumX ? coords.date : maximumX;
              minimumX = coords.date < minimumX ? coords.date : minimumX;
              maximumY = Math.max(maximumY, coords.value);
            });
          });

          height = $element[0].offsetHeight - margin * 2;
          width = $element[0].offsetWidth - margin * 2;
          xScale = d3.time.scale()
            .range([0, width]).domain([minimumX, maximumX]);
          yScale = d3.scale.linear()
            .range([height, 0]).domain([0, maximumY]);

          return {
            height: height,
            margin: margin,
            width: width,
            xScale: xScale,
            yScale: yScale
          };
        }

        /**
         * Draw the axes.
         */
        function configureAxes() {
          var xAxisGen = d3.svg.axis()
              .scale(dimensions.xScale)
              .tickFormat(d3.time.format('%d/%m/%y'));
          var xAxisTransform = 'translate(' +
              dimensions.margin + ', ' +
              (dimensions.height + dimensions.margin) + ')';
          if (xAxis === undefined) {
            xAxis = svg.append('g')
              .attr('class', 'xAxis')
              .attr('transform', xAxisTransform)
              .call(xAxisGen);
          }
          xAxis
            .transition()
            .duration(5000)
            .attr('transform', xAxisTransform)
            .call(xAxisGen);

          var yAxisGen = d3.svg.axis()
              .orient('left')
              .scale(dimensions.yScale);
          var yAxisTransform = 'translate(' +
              dimensions.margin + ', ' +
              dimensions.margin + ')';
          if (yAxis === undefined) {
            yAxis = svg.append('g')
              .attr('class', 'yAxis')
              .attr('transform', yAxisTransform)
              .call(yAxisGen);
          }
          yAxis
            .transition()
            .duration(5000)
            .attr('transform', yAxisTransform)
            .call(yAxisGen);
        }

        /**
         * Draw the graph lines.
         */
        function configureLines() {
          var lineGen = d3.svg.line()
              .x(function(d) {
                return dimensions.xScale(d.date);
              })
              .y(function(d) {
                return dimensions.yScale(d.value);
              });

          var lines = svg.selectAll('path.graph')
              .data(lineData, function(d) {
                return d.id;
              });
          lines.enter()
            .append('path')
            .attr('class', function(d) {
              return 'graph ' + d.id;
            })
            .attr('d', function(d) {
              return lineGen(d.data);
            })
            .attr('fill', 'none')
            .attr('transform', 'translate(' +
                  dimensions.margin + ', ' +
                  dimensions.margin + ')');
          lines
            .attr('stroke', 'black')
            .transition()
            .duration(5000)
            .attr('d', function(d) {
              return lineGen(d.data);
            });
          lines.exit();
        }
      }

      /**
       * Handle data update event.
       *
       * @param {Object} newValue - The new value to show data for.
       */
      function onSelectedUpdated(newValue) {
        graphService.getData(newValue)
          .then(refreshData)
          .catch(function(err) {
            console.log(err);
          });
      }

      /**
       * Setup the svg slement.
       */
      function setup() {
        svg = d3.select($element[0]).append('svg')
          .attr('width', '100%')
          .attr('height', '100%');
      }
    }
  }
})();

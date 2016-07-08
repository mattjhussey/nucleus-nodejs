(function() {
  'use strict';
  module.exports = directive;

  var template = require('./map.html');

  var d3 = require('d3');

  var $ = require('jquery');

  /**
   * Directive builder function.
   *
   * @param {object} mapService - Service to provide maps.
   * @returns {object} Directive definition Object.
   */
  function directive(mapService) {
    return {
      link: link,
      restrict: 'E',
      scope: {
        onSelected: '&onSelected',
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

      setup();
      $scope.$watch('selected', onSelectedUpdated);

      /**
       * Calculate the scale to use based on the features and projected path.
       * The scale should scale the features so that they fit 95% of the
       * available space.
       *
       * @param {object} path - The project d3 path used for geo calculations.
       * @param {object} features - Feature collection.
       * @returns {object} Scale to apply to features to fill available space.
       */
      function calculateScale(path, features) {
        var height = $element[0].offsetHeight;
        var width = $element[0].offsetWidth;
        var boundingBox = path.bounds(features);
        var north = boundingBox[1][1];
        var south = boundingBox[0][1];
        var east = boundingBox[1][0];
        var west = boundingBox[0][0];
        var boundingBoxWidth = Math.abs(east - west);
        var boundingBoxHeight = Math.abs(north - south);
        var widthRatio = width / boundingBoxWidth;
        var heightRatio = height / boundingBoxHeight;
        var minimumRatio = Math.min(widthRatio, heightRatio);
        var scale = 0.95 * minimumRatio;
        return scale;
      }

      /**
       * Calculate the translation needed to centre the features within the
       * available space.
       *
       * @param {object} path - D3 path used for geo calculations.
       * @param {object} features - The feature to fit into the space.
       * @returns {object} Translation to apply.
       */
      function calculateTranslation(path, features) {
        var height = $element[0].offsetHeight;
        var width = $element[0].offsetWidth;
        var boundingBox = path.bounds(features);
        var north = boundingBox[1][1];
        var south = boundingBox[0][1];
        var east = boundingBox[1][0];
        var west = boundingBox[0][0];
        var horizontalMidpoint = (east + west) / 2;
        var verticalMidpoint = (north + south) / 2;
        var horizontalTargetMidpoint = width / 2;
        var verticalTargetMidpoint = height / 2;
        var horizontalOffset = horizontalTargetMidpoint - horizontalMidpoint;
        var verticalOffset = verticalTargetMidpoint - verticalMidpoint;
        var translation = [horizontalOffset, verticalOffset];
        return translation;
      }

      /**
       * Return a class definition for the piece of data.
       *
       * @param {object} d - Data object
       * @returns {object} Class string
       */
      function classDefinition(d) {
        var re = /\d+$/;
        var reArray = re.exec(d.properties.IDENTITY);
        var colourId = parseInt(reArray[0]) % 7 + 1;
        return 'REGION REGION-' +
          d.properties.IDENTITY +
          ' REGION-COLOUR-' + colourId;
      }

      /**
       * Log the click event of an entity.
       *
       * @param {object} d - The clicked data object
       */
      function logClick(d) {
        $scope.onSelected({
          selected: d.properties.IDENTITY});
      }

      /**
       * Handle updated selection by getting the new map and refreshing.
       *
       * @param {object} newValue - The new map to display.
       */
      function onSelectedUpdated(newValue) {
        mapService.getMap(newValue)
          .then(refreshData)
          .catch(function(err) {
            console.log(err);
          });
      }

      /**
       * Refresh the view.
       *
       * @param {object} features - The features to update.
       */
      function refreshData(features) {
        var projection = d3.geo.mercator()
            .center([-150, 0])
            .scale(1)
            .translate([0, 0]);

        var path = d3.geo.path()
            .projection(projection);

        var scale = calculateScale(path, features);
        projection
          .scale(scale);

        var translation = calculateTranslation(path, features);
        projection
          .translate(translation);

        var data = svg.selectAll('.REGION')
            .data(features.features, function(d) {
              return d.properties.IDENTITY;
            });

        svg.on('click', features.parent ? function() {
          $scope.onSelected({
            selected: features.parent
          });
        } : undefined);

        // Update existing
        // data
        //   .attr('class', classDefinition)
        //   .attr('d', path)
        //   .on('click', logClick);

        // Add new
        data
          .enter()
          .append('path');

        // Update existing and new
        data
          .attr('class', classDefinition)
          .attr('d', path)
          .attr('transform', null)
          .on('click', function(d) {
            d3.event.stopPropagation();
            var translation = calculateTranslation(path, d);
            var transform1 = 'translate(' +
                translation[0] + ', ' +
                translation[1] + ')';

            d3.select(this)
              .each(function() {
                this.parentNode.appendChild(this);
              });

            var height = $element[0].offsetHeight;
            var width = $element[0].offsetWidth;
            var scale = calculateScale(path, d);
            var horizontalOffset = width / 2;
            var verticalOffset = height / 2;
            var transform2 =
                'translate(' +
                horizontalOffset + ', ' +
                verticalOffset + ') ' +
                'scale(' + scale + ') ' +
                'translate(' +
                (translation[0] - horizontalOffset) + ', ' +
                (translation[1] - verticalOffset) + ')';

            d3.select(this)
              .transition()
              .duration(1000)
              .attr('transform', transform1)
              .transition()
              .duration(1000)
              .ease('bounce')
              .attr('transform', transform2)
              .each('end', function() {
                logClick(d);
              });
          });

        // Remove old
        data
          .exit()
          .remove();
      }

      /**
       * Setup the directive
       */
      function setup() {
        svg = d3.select($element[0]).append('svg')
          .attr('width', '100%')
          .attr('height', '100%');
      }
    }
  }
})();

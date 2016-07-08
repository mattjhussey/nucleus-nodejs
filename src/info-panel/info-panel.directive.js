(function() {
  'use strict';
  module.exports = directive;

  var template = require('./info-panel.html');

  /**
   * Directive configuration function.
   *
   * @returns {Object} Data definition object for the directive.
   */
  function directive() {
    return {
      link: link,
      restrict: 'E',
      scope: {
        selected: '@selected'
      },
      template: template
    };

    /**
     * UI Logic
     */
    function link() {
    }
  }
})();

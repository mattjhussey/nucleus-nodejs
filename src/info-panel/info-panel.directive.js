(function() {
  'use strict';
  module.exports = directive;

  var template = require('./info-panel.html');

  function directive() {
    return {
      link: link,
      restrict: 'E',
      scope: {
        selected: '@selected'
      },
      template: template
    };

    function link() {
    } 
  }
})();

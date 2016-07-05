(function() {
  'use strict';
  module.exports = Service;

  function Service($http) {
    this.getData = getData;

    function getData(path) {
      return $http.get('/data/' + path + '.json')
        .then(resolveFeatures);
    }

    function resolveFeatures(response) {
      return response.data;
    }
  }
})();

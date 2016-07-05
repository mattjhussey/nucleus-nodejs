'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('mjhtest.maps map service', function() {
  beforeEach(
    'Load test module',
    angular.mock.module(function($provide) {
      $provide.service('mapService', require('mjhtest-maps/map.service.js'));
    }));
  describe('requesting a map', function() {
    var returnedMap;
    var expectedMap = {};
    beforeEach(
      'Request a map',
      inject(function(_$httpBackend_, _mapService_, _$rootScope_) {
        var mapId = 'TestMap';
        _$httpBackend_.expectGET('/data/geodata/' + mapId + '.json')
          .respond(expectedMap);
        returnedMap = _mapService_.getMap(mapId);
        _$httpBackend_.flush();

        // Resolve the promise
        _$rootScope_.$digest();
      }));
    it('should return the requested map', function() {
      expect(returnedMap).to.eventually.equal(expectedMap);
    });
  });
});

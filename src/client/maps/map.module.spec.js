'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var $ = require('jquery');
var sinon = require('sinon');
var d3 = require('d3');

addD3Events();

describe('mjhtest.maps module', function() {
  var html = '<mjhtest-map on-selected=\"_testOnSelected(selected)\" ' +
      'selected=\"{{ _testSelected }}\"></mjhtest-map>';
  var sandbox;
  var $scope;

  beforeEach(
    'Create Mock Sandbox',
    function() {
      sandbox = sinon.sandbox.create();
    });
  beforeEach(
    'Load the test module',
    angular.mock.module(require('mjhtest-maps')));
  beforeEach(
    'Create $scope',
    inject(function(_$rootScope_) {
      $scope = _$rootScope_.$new();

      /**
       * Placeholder for spies to attach to.
       *
       * @param {object} selected - The item that has been selected.
       */
      $scope._testOnSelected = function(selected) {};
      $scope._testSelected = undefined;
    }));

  afterEach(
    'Destroy the $scope',
    function() {
      $scope.$destroy();
    });
  afterEach(
    'Clean the mock sandbox',
    function() {
      sandbox.restore();
    });

  describe('loading a map', function() {
    var element;
    var mapServiceStub;

    beforeEach(
      'Set up mapService.getMap stub',
      inject(function(mapService) {
        mapServiceStub = sandbox.stub(mapService, 'getMap');
      }));

    beforeEach(
      'Load map',
      inject(function(_$compile_, _$q_) {
        var selected = 'test.geojson';
        var json = require('./simple1.spec.geojson');
        var promise = _$q_.when(json);
        mapServiceStub.withArgs(selected)
          .returns(promise);

        $scope._testSelected = selected;
        element = _$compile_(html)($scope);
        $scope.$digest();

        /* jshint expr:true */
        expect(mapServiceStub.withArgs(selected).calledOnce).to.be.true;
      }));

    it('should display the desired map', function() {
      var pathElements = $(element).find('svg path.REGION-Region-Simple1');
      expect(pathElements.length).to.equal(1);
    });

    describe('loading a new map', function() {
      beforeEach(
        'Load new map',
        inject(function(_$q_) {
          var selectedNew = 'test2.geojson';
          var json2 = require('./simple2.spec.geojson');
          var promise = _$q_.when(json2);
          mapServiceStub.withArgs(selectedNew)
            .returns(promise);

          $scope._testSelected = selectedNew;
          $scope.$digest();

          /* jshint expr:true */
          expect(mapServiceStub.withArgs(selectedNew).calledOnce).to.be.true;
        }));

      it('should no longer have the old elements', function() {
        var oldElements = $(element).find('svg path.REGION-Simple1');
        expect(oldElements.length).to.equal(0);
      });

      it('should have 2 paths', function() {
        var pathElements = $(element).find('svg path');
        expect(pathElements.length).to.equal(2);
      });

      ['Region-Simple2_1', 'Region-Simple2_2'].forEach(
        function(option) {
          it('should have the path "REGION-' + option + '"', function() {
            var newElements = $(element).find('svg path.REGION-' + option);
            expect(newElements.length).to.equal(1);
          });
        });
    });

    describe('clicking an element', function() {
      var spy;
      var fakeClock;
      beforeEach(
        'Configure fake clock',
        function() {
          fakeClock = sandbox.useFakeTimers();
        });
      beforeEach(
        'Setup spy',
        function() {
          spy = sandbox.spy($scope, '_testOnSelected');
          spy.withArgs('FirstSimple1');
        });
      beforeEach(
        'Click Element',
        function() {
          var pathElements = $(element).find('svg path.REGION-Region-Simple1');
          pathElements.d3Click();
        });
      beforeEach(
        'Wait for transition',
        function() {
          fakeClock.tick(2000);
          d3.timer.flush();
        });

      afterEach(
        'Remove fake clock',
        function() {
          fakeClock.restore();
        });

      it('should notify of clicked map elements', function() {
        /* jshint expr:true */
        expect(spy.withArgs('Region-Simple1').calledOnce).to.be.true;
      });
    });

    describe('Clicking the background', function() {
      var spy;

      beforeEach(
        'Define callback spy',
        function() {
          spy = sandbox.spy($scope, '_testOnSelected');
          spy.withArgs('FirstSimple1');
        });
      beforeEach(
        'Click the background',
        function() {
          var backgroundElement = $(element).find('svg');
          backgroundElement.d3Click();
        });

      it('should notify of clicked parent', function() {
        /* jshint expr:true */
        expect(spy.withArgs('SimpleParent').calledOnce).to.be.true;
      });
    });
  });
});

/**
 * D3 click events don't trigger using jquery's click event so this adds
 * a d3 events to jquery.
 */
function addD3Events() {
  $.fn.d3Click = buildMouseEvent('click');
  $.fn.d3DblClick = buildMouseEvent('dblclick');
}

/**
 * D3 click events don't trigger using jquery's click events so this
 * can be added to jquery to add d3 events.
 *
 * @param {object} identifier - The name of the Mouse event to use.
 * @returns {object} A function that will generate a Mouse event.
 */
function buildMouseEvent(identifier) {
  return function() {
    /* jshint validthis: true */
    this.each(function(i, e) {
      var evt = new MouseEvent(identifier);
      e.dispatchEvent(evt);
    });
  };
}

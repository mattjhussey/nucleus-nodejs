'use strict';
require('chai').use(require('chai-as-promised'));
var expect = require('chai').expect;

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it(
    'should render view-map',
    function() {
      var map = element.all(by.css('e3va-map'));
      /* jshint expr: true */
      expect(map).to.eventually.exist;
    });
});

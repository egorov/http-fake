const assert = require('assert');

class RequestBodyMatchHandler {
  constructor(expectedBodies) {
    this._expected = expectedBodies;
  }

  handle(actual) {
    'use strict';

    let expected;

    if (typeof actual !== 'undefined')
      expected = this._expected.dequeue();

    if(typeof expected === 'object')
      expected = JSON.stringify(expected);

    const msg = `Expected body content ${expected}, but actual content is ${actual}`;
    assert.equal(expected, actual, msg);
  }
}

module.exports = RequestBodyMatchHandler;
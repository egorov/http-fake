const assert = require('assert');

class RequestUrlCheckCommand {
  constructor(expectedUrls, actualUrls) {
    this._expected = expectedUrls;
    this._actual = actualUrls;
  }

  execute() {
    'use strict';

    if(this._expected.getCount() === 0)
      return;

    const expected = this._expected.dequeue();
    const actual = this._actual.dequeue();

    const msg = `Expected url ${expected}, but actual url is ${actual}`;
    assert.equal(expected, actual, msg);
  }
}

module.exports = RequestUrlCheckCommand;
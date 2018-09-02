const Queue = require('fixed-size-queue'),
    assert = require('assert');

class RequestBodyMatchHandler {
    constructor(expectedBodies){
        this._expected = expectedBodies;
    }

    handle(actual){
        'use strict';

        const body = this._expected.dequeue();
        const expected = JSON.stringify(body);
        const msg = `Expected body content ${expected}, but actual content is ${actual}`;
        assert.equal(expected, actual, msg);
    }
}

module.exports = RequestBodyMatchHandler;
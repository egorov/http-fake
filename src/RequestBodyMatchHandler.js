const assert = require('assert');

class RequestBodyMatchHandler {
    constructor(expectedBodies){
        this._expected = expectedBodies;
    }

    handle(actual){
        'use strict';

        let body;

        if(typeof actual !== 'undefined')
            body = this._expected.dequeue();

        const expected = JSON.stringify(body);
        const msg = `Expected body content ${expected}, but actual content is ${actual}`;
        assert.equal(expected, actual, msg);
    }
}

module.exports = RequestBodyMatchHandler;
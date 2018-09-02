const Queue = require('fixed-size-queue');
const assert = require('assert');

class RequestOptionsMatchCommand {

    constructor(expectedOptions, actualOptions){
        this._expected = expectedOptions;
        this._actual = actualOptions;
    }

    execute(){
        'use strict';

        const expect = this._expected.dequeue();
        const actual = this._actual.dequeue();

        for(let name in expect){

            if(name === 'body')
                continue;

            let msg =   'Expected options.' + name +
                ' == ' + expect[name] +
                ', actual is ' + actual[name] + '!';
            assert.deepEqual(expect[name], actual[name], msg);
        }
    }
}

module.exports = RequestOptionsMatchCommand;
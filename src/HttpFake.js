const ClientRequestFake = require('./ClientRequestFake'),
    IncomingMessage = require('./IncomingMessageFake'),
    split = require('./SplitStringToChunks'),
    Queue = require('fixed-size-queue'),
    assert = require('assert'),
    RespErrorCmd = require('./ResponseErrorCommand');

class HttpFake {

    constructor(){
        this._expOptions = Queue.create(1000);
        this._actOptions = Queue.create(1000);
        this._expBodies = Queue.create(1000);
        this._errors = Queue.create(1000);
        this._willReturn = Queue.create(1000);
        this._callbacks = Queue.create(1000);
        this._responseErrorCommand =
            new RespErrorCmd(this._errors, this._callbacks);
    }

    expect(request){
        'use strict';

        if((typeof request.body) !== 'undefined'){
            const body = request.body;
            this._expBodies.enqueue(body);
        }
        this._expOptions.enqueue(request);
    }

    returns(response){
        'use strict';

        this._willReturn.enqueue(response);
    }

    shouldThrow(error){
        'use strict';

        this._errors.enqueue(error);
    }

    request(options, callback){
        'use strict';

        this._saveOptions(options);
        this._saveCallback(callback);

        return this._makeRequest();
    }

    _saveOptions(options){
        'use strict';

        if((typeof options) !== 'object')
            throw new Error('options should be an object!');

        this._actOptions.enqueue(options);
    }

    _saveCallback(callback){
        'use strict';

        if((typeof callback) !== 'function')
            throw new Error('callback is required argument!')

        this._callbacks.enqueue(callback);
    }

    _makeRequest(){
        'use strict';

        const requestFake = new ClientRequestFake();
        const requestHandler = this._handleWithRequest.bind(this);
        requestFake.on('end', requestHandler);

        const bodyCheckHandler = this._checkRequestBody.bind(this);
        requestFake.on('write', bodyCheckHandler);

        return requestFake;
    }

    _handleWithRequest(){
        'use strict';

        this._tryToImitateRequestHandling();
        this._responseErrorCommand.execute();
        this._checkRequestOptions();
    }

    _tryToImitateRequestHandling(){
        'use strict';

        if(this._errors.getCount() > 0)
            return;

        const callback = this._callbacks.dequeue();
        const response = this._willReturn.dequeue();
        const message = new IncomingMessage(response);

        callback(message);

        const data = JSON.stringify(response.body);
        const chunks = split(data, 10);

        for(let i = 0; i < chunks.length; i++){
            message.emit('data', chunks[i]);
        }

        message.emit('end');
    }

    _checkRequestOptions(){
        const expect = this._expOptions.dequeue();
        const actual = this._actOptions.dequeue();

        for(let name in expect){

            if(name === 'body')
                continue;

            let msg =   'Expected options.' + name +
                        ' == ' + expect[name] +
                        ', actual is ' + actual[name] + '!';
            assert.deepEqual(expect[name], actual[name], msg);
        }
    }

    _checkRequestBody(actual){
        'use strict';

        const body = this._expBodies.dequeue();
        const expected = JSON.stringify(body);
        const msg = `Expected body content ${expected}, but actual content is ${actual}`;
        assert.equal(expected, actual, msg);
    }
}

module.exports = HttpFake;
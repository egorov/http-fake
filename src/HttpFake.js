const ClientRequestFake = require('./ClientRequestFake'),
    IncomingMessage = require('./IncomingMessageFake'),
    split = require('./SplitStringToChunks'),
    Queue = require('fixed-size-queue'),
    RespErrorCmd = require('./ResponseErrorCommand'),
    OptnsMatchCmd = require('./RequestOptionsMatchCommand'),
    ReqBodyMatchHndlr = require('./RequestBodyMatchHandler');

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
        this._optionsMatchCommand =
            new OptnsMatchCmd(this._expOptions, this._actOptions);
        this._bodyMatchHandler =
            new ReqBodyMatchHndlr(this._expBodies);
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

        const bodyCheckHandler =
            this._bodyMatchHandler.handle.bind(this._bodyMatchHandler);
        requestFake.on('write', bodyCheckHandler);

        return requestFake;
    }

    _handleWithRequest(){
        'use strict';

        this._tryToImitateRequestHandling();
        this._responseErrorCommand.execute();
        this._optionsMatchCommand.execute();
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
}

module.exports = HttpFake;
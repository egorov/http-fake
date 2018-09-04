const ClientRequestFake = require('./ClientRequestFake'),
    IncomingMessage = require('./IncomingMessageFake'),
    split = require('./SplitStringToChunks'),
    ResponseErrorCommand = require('./ResponseErrorCommand'),
    OptionsMatchCommand = require('./RequestOptionsMatchCommand'),
    RequestBodyMatchHandler = require('./RequestBodyMatchHandler'),
    Storage = require('./Queues');

class HttpFake {

    constructor(){

        this._queues = new Storage();

        this._responseErrorCommand = new ResponseErrorCommand(
            this._queues.errorsExpected,
            this._queues.callbacks);

        this._optionsMatchCommand = new OptionsMatchCommand(
            this._queues.optionsExpected,
            this._queues.optionsActual);

        this._bodyMatchHandler = new RequestBodyMatchHandler(
            this._queues.bodiesExpected);
    }

    expect(request){
        'use strict';

        if((typeof request.body) !== 'undefined'){
            const body = request.body;
            this._queues.bodiesExpected.enqueue(body);
        }
        this._queues.optionsExpected.enqueue(request);
    }

    returns(response){
        'use strict';

        this._queues.responsesExpected.enqueue(response);
    }

    shouldThrow(error){
        'use strict';

        this._queues.errorsExpected.enqueue(error);
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

        this._queues.optionsActual.enqueue(options);
    }

    _saveCallback(callback){
        'use strict';

        if((typeof callback) !== 'function')
            throw new Error('callback is required argument!')

        this._queues.callbacks.enqueue(callback);
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

        if(this._queues.errorsExpected.getCount() > 0)
            return;

        const callback = this._queues.callbacks.dequeue();
        const response = this._queues.responsesExpected.dequeue();
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
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
            this._queues.responseErrors,
            this._queues.callbacks);

        this._optionsMatchCommand = new OptionsMatchCommand(
            this._queues.optionsExpected,
            this._queues.optionsActual);

        this._bodyMatchHandler = new RequestBodyMatchHandler(
            this._queues.bodiesExpected);

        this._request = null;
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

    responseThrow(error){
        'use strict';

        this._queues.responseErrors.enqueue(error);
    }

    requestThrow(error){
        'use strict';

        this._queues.requestErrors.enqueue(error);
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

        this._request = new ClientRequestFake();
        const requestHandler = this._handleWithRequest.bind(this);
        this._request.on('end', requestHandler);

        const bodyCheckHandler =
            this._bodyMatchHandler.handle.bind(this._bodyMatchHandler);
        this._request.on('write', bodyCheckHandler);

        return this._request;
    }

    _handleWithRequest(){
        'use strict';

        this._tryToImitateRequestHandling();
        this._imitateRequestError();
        this._responseErrorCommand.execute();
        this._optionsMatchCommand.execute();
    }

    _tryToImitateRequestHandling(){
        'use strict';

        if(this._queues.responseErrors.getCount() > 0)
            return;

        if(this._queues.requestErrors.getCount() > 0)
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

    _imitateRequestError(){
        'use strict';

        if(this._queues.requestErrors.getCount() === 0)
            return;

        const error = this._queues.requestErrors.dequeue();
        this._request.emit('error', error);
    }
}

module.exports = HttpFake;
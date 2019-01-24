const ClientRequestFake = require('./ClientRequestFake'),
    ResponseSendCommand = require('./ResponseSendCommand'),
    ResponseErrorCommand = require('./ResponseErrorCommand'),
    RequestErrorCommand = require('./RequestErrorCommand'),
    OptionsMatchCommand = require('./RequestOptionsMatchCommand'),
    RequestBodyMatchHandler = require('./RequestBodyMatchHandler'),
    ExpressResponseFake = require('./ExpressResponseFake'),
    Storage = require('./Queues');

class HttpFake {

    constructor(){

        this._queues = new Storage();

        this._responseSendCommand = new ResponseSendCommand(this._queues);

        this._responseErrorCommand = new ResponseErrorCommand(
            this._queues.responseErrors,
            this._queues.callbacks);

        this._optionsMatchCommand = new OptionsMatchCommand(
            this._queues.optionsExpected,
            this._queues.optionsActual);

        this._bodyMatchHandler = new RequestBodyMatchHandler(
            this._queues.bodiesExpected);

        this._request = new ClientRequestFake();

        this._requestErrorCommand = new RequestErrorCommand(
            this._queues.requestErrors,
            this._request
        );
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

        this._request.removeAllListeners('end');
        this._request.removeAllListeners('write');
      
        const requestHandler = this._handleWithRequest.bind(this);
        this._request.on('end', requestHandler);

        const bodyCheckHandler =
            this._bodyMatchHandler.handle.bind(this._bodyMatchHandler);
        this._request.on('write', bodyCheckHandler);

        return this._request;
    }

    _handleWithRequest(){
        'use strict';

        this._responseSendCommand.execute();
        this._requestErrorCommand.execute();
        this._responseErrorCommand.execute();
        this._optionsMatchCommand.execute();
    }

    static makeExpressResponseFake(){
        'use strict';

        return new ExpressResponseFake();
    }
}

module.exports = HttpFake;
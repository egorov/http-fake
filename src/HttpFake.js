const ClientRequestFake = require('./ClientRequestFake');
const IncomingMessage = require('./IncomingMessageFake');
const Queue = require('fixed-size-queue');

class HttpFake {

    constructor(){
        this._expecting = Queue.create(1000);
        this._willReturn = Queue.create(1000);
        this._callbacks = Queue.create(1000);
    }

    expect(request){
        this._expecting.enqueue(request);
    }

    get expecting(){
        return this._expecting;
    }

    returns(response){
        this._willReturn.enqueue(response);
    }

    get willReturn(){
        return this._willReturn;
    }

    request(options, callback){

        this._validateCallback(callback);

        const requestFake = new ClientRequestFake();

        this._callbacks.enqueue(callback);

        const handler = this.run.bind(this);
        requestFake.on('end', handler);

        return requestFake;
    }

    _validateCallback(callback){
        if((typeof callback) !== 'function')
            throw new Error('callback is required argument!')
    }

    run(){
        const callback = this._callbacks.dequeue();
        const response = this._willReturn.dequeue();
        const message = new IncomingMessage(response);
        callback(message);
    }
}

module.exports = HttpFake;
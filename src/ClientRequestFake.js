const EventEmitter = require('events');

class ClientRequestFake extends EventEmitter {

    constructor(httpFake = {}){
        super();
        this.http = httpFake;
    }

    end(){
        this.emit('end');
    }
    
    write(data){
        this.emit('write', data);
    }
}

module.exports = ClientRequestFake;
const EventEmitter = require('events');

class ClientRequestFake extends EventEmitter {

    end(){

    }
    
    write(data){

    }
}

module.exports = ClientRequestFake;
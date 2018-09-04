const EventEmitter = require('events');

class ClientRequestFake extends EventEmitter {

    end(){
        this.emit('end');
    }
    
    write(data){
        this.emit('write', data);
    }
}

module.exports = ClientRequestFake;
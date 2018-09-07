class ExpressResponseFake {
    constructor(){
        this._sent = null;
        this._statusCode = null;
    }

    send(data){
        this._sent = data;
    }

    get sent(){
        return this._sent;
    }

    status(code){
        this._statusCode = code;
        return this;
    }

    get statusCode() {
        return this._statusCode;
    }
}

module.exports = ExpressResponseFake;
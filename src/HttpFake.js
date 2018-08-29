const ClientRequestFake = require('./ClientRequestFake');

class HttpFake {

    constructor(){
        this._expecting = [];
        this._willReturn = [];
    }

    expect(request){
        this._expecting.push(request);
    }

    get expecting(){
        return this._expecting;
    }

    returns(response){
        this._willReturn.push(response);
    }

    get willReturn(){
        return this._willReturn;
    }

    request(options, callback){
        const requestFake = new ClientRequestFake();
        return requestFake;
    }
}

module.exports = HttpFake;
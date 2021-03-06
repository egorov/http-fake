describe('HttpFake', () => {

  const AssertionError = require('assert').AssertionError;
  const HttpFake = require('../src/HttpFake'),
    options = {
      hostname: 'localhost',
      port: 80,
      path: '/api/users/login',
      body: {
        login: 'jack',
        password: 'P@ssw0rd'
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    response = {
      statusCode: 200,
      body: {
        token: 'value is here'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  let http = null;

  beforeEach(() => {
    http = new HttpFake();
  });

  it('should deal with request callback', (done) => {

    http.expect(options);
    http.returns(response);

    const clientRequest = http.request(options, (res) => {

      expect(res.headers).toEqual(response.headers);
      expect(res.statusCode).toEqual(response.statusCode);

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        const body = JSON.parse(incomingData);
        expect(body).toEqual(response.body);
        done();
      });
    });

    const content = JSON.stringify(options.body);
    clientRequest.write(content);
    clientRequest.end();
  });

  it('should deal with response callback', (done) => {

    http.expect(options);
    http.returns(response);

    const clientRequest = http.request(options);

    clientRequest.on('response', (res) => {

      expect(res.headers).toEqual(response.headers);
      expect(res.statusCode).toEqual(response.statusCode);

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        const body = JSON.parse(incomingData);
        expect(body).toEqual(response.body);
        done();
      });
    });

    const content = JSON.stringify(options.body);
    clientRequest.write(content);
    clientRequest.end();
  });

  it('should deal with plain text body', (done) => {

    const optns = Object.assign({}, options);
    optns.body = 'login=jack&password=example';

    http.expect(optns);
    http.returns(response);

    const clientRequest = http.request(optns);

    clientRequest.on('response', (res) => {

      expect(res.headers).toEqual(response.headers);
      expect(res.statusCode).toEqual(response.statusCode);

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        const body = JSON.parse(incomingData);
        expect(body).toEqual(response.body);
        done();
      });
    });

    clientRequest.write(optns.body);
    clientRequest.end();
  });

  it('should deal with empty POST body request', (done) => {

    const opts = Object.assign({}, options);
    delete opts.body;

    http.expect(opts);
    http.returns({ statusCode: 200 });

    const clientRequest = http.request(opts, (res) => {

      expect(res.statusCode).toEqual(response.statusCode);

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        expect(incomingData).toEqual('');
        done();
      });
    });

    clientRequest.write();
    clientRequest.end();
  });

  it('should imitate GET request with callback', (done) => {

    const opts = Object.assign({}, options);
    opts.method = 'GET';
    delete opts.body;

    http.expect(opts);
    http.returns({ statusCode: 200, statusMessage: 'OK' });

    const clientRequest = http.request(opts, (res) => {

      expect(res.statusCode).toEqual(200);
      expect(res.statusMessage).toEqual('OK');

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        expect(incomingData).toEqual('');
        done();
      });
    });

    clientRequest.end();
  });

  it('should imitate GET request with response callback', (done) => {

    const opts = Object.assign({}, options);
    opts.method = 'GET';
    delete opts.body;

    http.expect(opts);
    http.returns({ statusCode: 200, statusMessage: 'OK' });

    const clientRequest = http.request(opts);
    
    clientRequest.on('response', (res) => {

      expect(res.statusCode).toEqual(200);
      expect(res.statusMessage).toEqual('OK');

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        expect(incomingData).toEqual('');
        done();
      });
    });

    clientRequest.end();
  });

  it('should imitate GET request with text response body', (done) => {

    const opts = Object.assign({}, options);
    opts.method = 'GET';
    delete opts.body;

    http.expect(opts);
    http.returns({ statusCode: 200, statusMessage: 'OK', body: 'key=value' });

    const clientRequest = http.request(opts);
    
    clientRequest.on('response', (res) => {

      expect(res.statusCode).toEqual(200);
      expect(res.statusMessage).toEqual('OK');

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        expect(incomingData).toEqual('key=value');
        done();
      });
    });

    clientRequest.end();
  });

  it('should imitate GET request with url and options', (done) => {

    const url = 'http://localhost/api/login';
    const opts = {
      auth: 'jack:example',
      method: 'GET'
    };

    http.expect(url, opts);
    http.returns({ statusCode: 200, statusMessage: 'OK', body: 'key=value' });

    const clientRequest = http.request(url, opts);
    
    clientRequest.on('response', (res) => {

      expect(res.statusCode).toEqual(200);
      expect(res.statusMessage).toEqual('OK');

      let incomingData = '';

      res.on('data', (chunk) => {

        incomingData += chunk;
      });

      res.on('end', () => {

        expect(incomingData).toEqual('key=value');
        done();
      });
    });

    clientRequest.end();
  });

  it('should emit response error', (done) => {

    http.expect(options);
    http.responseThrow(new Error('Something goes wrong!'));

    const clientRequest = http.request(options, (res) => {

      res.on('error', (error) => {

        expect(error.message).toEqual('Something goes wrong!');
        done();
      });
    });

    clientRequest.end();
  });

  it('should emit request error', (done) => {

    const msg = 'Something goes wrong!';
    http.expect(options);
    http.requestThrow(new Error(msg));

    const clientRequest = http.request(options, () => { });
    clientRequest.on('error', (error) => {

      expect(error.message).toEqual(msg);
      done();
    });

    clientRequest.end();
  });

  it('should fall if url does not match', (done) => {

    http.expect('http://localhost', {method: 'GET'});
    http.returns(response);

    const method = () => {
      const clientRequest = http.request('http://stub', {method: 'GET'}, () => { 
        done();
      });
      clientRequest.end();
    };
    const msg = 'Expected url http://localhost, but actual url is http://stub';
    expect(method).toThrowError(AssertionError, msg);
  });

  it('should fall if options does not match', () => {

    http.expect(options);
    http.returns(response);

    const method = () => {
      const clientRequest = http.request({ hostname: '::1' }, () => { });
      clientRequest.end();
    };
    const msg = 'Expected options.hostname == localhost, actual is ::1!';
    expect(method).toThrowError(AssertionError, msg);
  });

  it('should make expressjs response fake', () => {

    const res = HttpFake.makeExpressResponseFake();

    expect(typeof res.send).toEqual('function');
    expect(typeof res.status).toEqual('function');
  });
});
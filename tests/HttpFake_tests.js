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

  it('request should throw if options is omitted', () => {

    const method = () => {
      http.request();
    };
    expect(method).toThrow(new Error('options should be an object!'));
  });

  it('should make expressjs response fake', () => {

    const res = HttpFake.makeExpressResponseFake();

    expect(typeof res.send).toEqual('function');
    expect(typeof res.status).toEqual('function');
  });
});
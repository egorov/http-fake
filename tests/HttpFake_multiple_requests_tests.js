describe('HttpFake multiple requests', () => {

  const AssertionError = require('assert').AssertionError;
  const HttpFake = require('../src/HttpFake'),
    options = require('./options'),
    responses = require('./responses');  
  let http = null;

  beforeEach(() => {
    http = new HttpFake();
  });

  it('should deal with request callback', (done) => {

    http.expect(options[0]);
    http.returns(responses[0]);
    http.expect(options[1]);
    http.returns(responses[1]);

    const first = http.request(options[0], (res) => {

      expect(res.headers).toEqual(responses[0].headers);
      expect(res.statusCode).toEqual(responses[0].statusCode);

      let fd = '';

      res.on('data', (chunk) => {

        fd += chunk;
      });

      res.on('end', () => {

        const fb = JSON.parse(fd);
        expect(fb).toEqual(responses[0].body);

        const second = http.request(options[1]);
        second.on('response', (res) => {

          expect(res.headers).toEqual(responses[1].headers);
          expect(res.statusCode).toEqual(responses[1].statusCode);
    
          let sd = '';
    
          res.on('data', (chunk) => {
    
            sd += chunk;
          });
    
          res.on('end', () => {
    
            const sb = JSON.parse(sd);
            expect(sb).toEqual(responses[1].body);
            done();
          });
        });
    
        const content = JSON.stringify(options[1].body);
        second.write(content);
        second.end();    
      });
    });

    const content = JSON.stringify(options[0].body);
    first.write(content);
    first.end();
  });
});
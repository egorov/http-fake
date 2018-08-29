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

    it('should add expected request options', () => {

        http.expect(options);

        expect(http.expecting.getCount()).toEqual(1);
        expect(http.expecting.peek()).toEqual(options);
    });

    it('should add supposed response', () => {

        http.returns(response);

        expect(http.willReturn.getCount()).toEqual(1);
        expect(http.willReturn.peek()).toEqual(response);
    });

    it('should return expected response', () => {

        http.expect(options);
        http.returns(response);

        const clientRequest = http.request(options, (res) => {

            expect(res.headers).toEqual(response.headers);
            expect(res.statusCode).toEqual(response.statusCode);

            res.on('data', (chunk) => {

                const body = JSON.parse(chunk);
                expect(body).toEqual(response.body);
            });
        });

        const content = JSON.stringify(options.body);
        clientRequest.write(content);
        clientRequest.end();
    });

    it('should fall if options does not match', () => {

        http.expect(options);
        http.returns(response);

        const method = () =>{
            const clientRequest = http.request({ hostname: '::1'},(res) => {});
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

    it('request should throw if callback is omitted', () => {

        const method = () => {
            http.request({});
        };
        expect(method).toThrow(new Error('callback is required argument!'));
    });
});
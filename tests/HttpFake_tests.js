describe('HttpFake', () => {

    const HttpFake = require('../src/HttpFake'),
        options = {
            url: 'localhost',
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
            }
        };
    let http = null;

    beforeEach(() => {
       http = new HttpFake();
    });

    it('should add expected request options', () => {

        http.expect(options);

        expect(http.expecting.length).toEqual(1);
        expect(http.expecting[0]).toEqual(options);
    });

    it('should add supposed response', () => {

        http.returns(response);

        expect(http.willReturn.length).toEqual(1);
        expect(http.willReturn[0]).toEqual(response);
    });

    it('should return expected response', () => {

        http.returns(response);

        const clientRequest = http.request(options, (res) => {

            res.on('data', (chunk) => {

                const body = JSON.parse(chunk);
                expect(body).toEqual(response.body);
            });

            expect(res.statusCode).toEqual(response.statusCode);
        });

        const content = JSON.stringify(options.body);
        clientRequest.write(content);
        clientRequest.end();
    });
});
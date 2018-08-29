describe('HttpFake', () => {

    const HttpFake = require('../src/HttpFake');
    let http = null;

    beforeEach(() => {
       http = new HttpFake();
    });

    it('should add expected request', () => {

        const request = {
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
        };

        http.expect(request);

        expect(http.expecting.length).toEqual(1);
        expect(http.expecting[0]).toEqual(request);
    });

    it('should add supposed response', () => {

        const response = {
            statusCode: 200,
            body: {
                token: 'value is here'
            }
        };

        http.returns(response);

        expect(http.willReturn.length).toEqual(1);
        expect(http.willReturn[0]).toEqual(response);
    });
});
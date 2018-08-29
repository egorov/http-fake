# Простой эмулятор http запросов для модульных тестов

Как пользоваться?

    describe('HttpFake', () => {
    
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

        it('should pass', () => {    
        
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
    });
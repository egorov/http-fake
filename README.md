# Простой эмулятор http запросов для модульных тестов

Как пользоваться?

    const HttpFake = require('http-fake');
    const http = new HttpFake();
    
    const request = {
        url: 'http://localhost/login',
        body: {
            login: 'jack',
            password: 'P@ssw0rd'
        },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = {
        statusCode: 200,
        body: {
            token: 'value is here'
        }
    };
    
    http.expect(request).returns(response);

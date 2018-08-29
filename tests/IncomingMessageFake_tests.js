describe('IncomingMessageFake', () => {

    const IncomingMessageFake = require('../src/IncomingMessageFake');
    let message = null,
        content = {
            statusCode: 200,
            headers: {
                Authorization: 'token',
                'Content-Type': 'application/json'
            },
            body: {
                message: 'have been caught'
            }
        };

    beforeEach(() => {
        message = new IncomingMessageFake(content);
    });

    it('should return headers', () => {

        expect(message.headers).toEqual(content.headers);
    });

    it('should return statusCode', () => {

        expect(message.statusCode).toEqual(content.statusCode);
    });
});
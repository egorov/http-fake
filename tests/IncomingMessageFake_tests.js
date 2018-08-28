describe('IncomingMessageFake', () => {

    const IncomingMessageFake = require('../src/IncomingMessageFake');
    let message = null,
        headers = {
            Authorization: 'token',
            'Content-Type': 'application/json'
        };

    beforeEach(() => {
        message = new IncomingMessageFake(headers);
    });

    it('should return headers', () => {

        expect(message.headers).toEqual(headers);
    });
});
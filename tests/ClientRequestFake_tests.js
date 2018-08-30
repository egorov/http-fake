describe('ClientRequestFake', () => {

    const ClientRequestFake = require('../src/ClientRequestFake');
    let request = null;

    beforeEach(() => {
        request = new ClientRequestFake();
    });

    it('should emit an error', () => {

        const errors = [];
        request.on('error', (error) => {
            errors.push(error);
        });

        request.emit('error', 'Something goes wrong!');

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Something goes wrong!');
    });

    it('should implement end method', () => {

        expect(typeof request.end).toEqual('function');
    });

    it('should implement write method', () => {

        expect(typeof request.write).toEqual('function');
    });

    it('should emit write event', () => {

        let messages = [],
            msg = 'Hello!';

        request.on('write', (data) => messages.push(data));
        request.write(msg);

        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual(msg);
    });

    it('should emit end event', () => {

        let counter = 0;
        request.on('end', () => counter++);
        request.end();

        expect(counter).toEqual(1);
    });
});
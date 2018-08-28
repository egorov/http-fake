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
});
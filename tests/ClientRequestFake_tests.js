describe('ClientRequestFake', () => {

    const ClientRequestFake = require('../src/ClientRequestFake');

    it('should emit an error', () => {

        const request = new ClientRequestFake();
        const errors = [];
        request.on('error', (error) => {
            errors.push(error);
        })

        request.emit('error', 'Something goes wrong!');

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Something goes wrong!');
    });
});
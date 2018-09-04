describe('RequestErrorCommand', () => {

    const Command = require('../src/RequestErrorCommand'),
        Queues = require('../src/Queues'),
        Request = require('../src/ClientRequestFake'),
        queues = new Queues(),
        request = new Request(),
        command = new Command(queues.requestErrors, request);

    it('should emit an error', (done) => {

        const expected = new Error('Something goes wrong!');

        queues.requestErrors.enqueue(expected);

        request.on('error', (actual) => {

            expect(actual).toEqual(expected);
            done();
        });

        command.execute();
    });
});
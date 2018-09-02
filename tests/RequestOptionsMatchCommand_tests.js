describe('RequestOptionsMatchCommand', () => {

    const Command = require('../src/RequestOptionsMatchCommand'),
        Queue = require('fixed-size-queue'),
        expOptions = Queue.create(10),
        actOptions = Queue.create(10),
        expected = {
            hostname: 'localhost',
            port: 80,
            path: '/api/users'
        },
        actual = {
            hostname: 'localhost',
            port: 80,
            path: '/api/users'
        };

    let command = null;

    beforeEach(() => {
        command = new Command(expOptions, actOptions);
    });

    it('should not throw', () => {

        expOptions.enqueue(expected);
        actOptions.enqueue(actual);

        const method = () => {
            command.execute();
        };

        expect(method).not.toThrow();
    });

    it('should throw', () => {

        expOptions.enqueue(expected);
        actOptions.enqueue({ hostname: 'localhost', port: 80 });

        const method = () => {
            command.execute();
        };

        expect(method).toThrow();
    });

    it('should not check body match', () => {

        expOptions.enqueue({ body: { name: 'Jack' }});
        actOptions.enqueue({ body: { name: 'Bill' }});

        const method = () => {
            command.execute();
        };

        expect(method).not.toThrow();
    });
});
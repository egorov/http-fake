describe('ResponseSendCommand', () => {
    'use strict';
    const Command = require('../src/ResponseSendCommand'),
       Queues = require('../src/Queues'),
       response = {
           statusCode: 200,
           body: {
               token: 'value is here'
           },
           headers: {
               'Content-Type': 'application/json'
           }
       };
    let command = null,
        queues = null;

    beforeEach(() => {
        queues = new Queues();
        command = new Command(queues);
    });

    it('should return expected response', (done) => {

        const callback = (res) => {

            let incomingData = '';

            res.on('data', (chunk) => {

                incomingData += chunk;
            });

            res.on('end', () => {

                const body = JSON.parse(incomingData);
                expect(body).toEqual(response.body);
                done();
            });
        };

        queues.callbacks.enqueue(callback);
        queues.responsesExpected.enqueue(response);
        command.execute();
    });

    it('should not execute if response error expected', () => {

        let counter = 0;
        const callback = (res) => {
            counter++;
        };
        queues.callbacks.enqueue(callback);
        queues.requestErrors.enqueue(new Error());
        command.execute();

        expect(counter).toEqual(0);
    });

    it('should not execute if request error expected', () => {

        let counter = 0;
        const callback = (res) => {
            counter++;
        };
        queues.callbacks.enqueue(callback);
        queues.responseErrors.enqueue(new Error());
        command.execute();

        expect(counter).toEqual(0);
    });
});
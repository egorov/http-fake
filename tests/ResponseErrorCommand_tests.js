describe('ImitateResponseErrorCommand', () => {
   'use strict';

    const ResponseErrorCommand = require('../src/ResponseErrorCommand'),
       Queue = require('fixed-size-queue'),
       errors = Queue.create(10),
       callbacks = Queue.create(10),
       expected = new Error('Something goes wrong!');

    let command;

    beforeEach(() => {
       command = new ResponseErrorCommand(errors, callbacks);
    });

    it('should emit an expected error', (done) => {

        const callback = (response) => {

            response.on('error', (error) => {

                expect(error).toEqual(expected);
                done();
            });
        };

       errors.enqueue(expected);
       callbacks.enqueue(callback);
       command.execute();
    });
});
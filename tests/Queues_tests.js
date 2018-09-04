describe('Storage', () => {
    'use strict';

    const Queues = require('../src/Queues'),
        queues = new Queues();

    it('should contain options queues', () => {

        expect(queues.optionsExpected.getCount()).toEqual(0);
        expect(queues.optionsExpected.getCapacity()).toEqual(10);

        expect(queues.optionsActual.getCount()).toEqual(0);
        expect(queues.optionsActual.getCapacity()).toEqual(10);
    });

    it('should contain bodies queues', () => {

        expect(queues.bodiesExpected.getCount()).toEqual(0);
        expect(queues.bodiesExpected.getCapacity()).toEqual(10);
    });

    it('should contain errors queues', () => {

        expect(queues.errorsExpected.getCount()).toEqual(0);
        expect(queues.errorsExpected.getCapacity()).toEqual(10);
    });

    it('should contain responses queues', () => {

        expect(queues.responsesExpected.getCount()).toEqual(0);
        expect(queues.responsesExpected.getCapacity()).toEqual(10);
    });

    it('should contain callbacks queues', () => {

        expect(queues.callbacks.getCount()).toEqual(0);
        expect(queues.callbacks.getCapacity()).toEqual(10);
    });
});
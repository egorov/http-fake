describe('Storage', () => {
  'use strict';

  const Queues = require('../src/Queues'),
    queues = new Queues();

  it('should contain urls queues', () => {

    expect(queues.urlsExpected.getCount()).toEqual(0);
    expect(queues.urlsExpected.getCapacity()).toEqual(10);

    expect(queues.urlsActual.getCount()).toEqual(0);
    expect(queues.urlsActual.getCapacity()).toEqual(10);
  });

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

  it('should contain response errors queues', () => {

    expect(queues.responseErrors.getCount()).toEqual(0);
    expect(queues.responseErrors.getCapacity()).toEqual(10);
  });

  it('should contain request errors queues', () => {

    expect(queues.requestErrors.getCount()).toEqual(0);
    expect(queues.requestErrors.getCapacity()).toEqual(10);
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
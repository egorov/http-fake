describe('RequestUrlCheckCommand', () => {
  'use strict';

  const RequestUrlCheckCommand = require('../src/RequestUrlCheckCommand'),
     Queue = require('fixed-size-queue'),
     expectedUrls = Queue.create(10),
     actualUrls = Queue.create(10),
     expectedUrl = 'http://localhost',
     actualUrl = 'http://not-localhost';

  let command = null;

  beforeEach(() => {
     command = new RequestUrlCheckCommand(expectedUrls, actualUrls);
  });

  it('should pass', () => {

     expectedUrls.enqueue(expectedUrl);
     actualUrls.enqueue(expectedUrl);

     const method = () => {
         command.execute();
     };
     expect(method).not.toThrow();
  });

  it('should throw', () => {

      expectedUrls.enqueue(expectedUrl);
      actualUrls.enqueue(actualUrl);

      const method = () => {
          command.execute();
      };
      expect(method).toThrow();
  });
});
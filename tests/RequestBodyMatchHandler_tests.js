describe('RequestBodyMatchHandler', () => {
   'use strict';

   const Handler = require('../src/RequestBodyMatchHandler'),
      Queue = require('fixed-size-queue'),
      expectedBodies = Queue.create(10),
      expectedBody = {
         login: 'jack',
         password: 'P@ssw0rd'
      },
      actualStr = '{"login":"jack","password":"P@ssw0rd"}';

   let handler = null;

   beforeEach(() => {
      handler = new Handler(expectedBodies);
   });

   it('should not throw', () => {

      expectedBodies.enqueue(expectedBody);

      const method = () => {
          handler.handle(actualStr);
      };
      expect(method).not.toThrow();
   });

   it('should throw', () => {

       expectedBodies.enqueue(expectedBody);

       const method = () => {
           handler.handle('{"login":"jack"}');
       };
       expect(method).toThrow();
   });
});
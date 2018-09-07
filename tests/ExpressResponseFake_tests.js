describe('ExpressResponseFake', () => {

    const Response = require('../src/ExpressResponseFake');
    let res;

    beforeEach(() => {
        res = new Response();
    });

    it('should return sent data', () => {

        const data = { id: '123', name: 'Jack' };
        res.send(data);

        expect(res.sent).toEqual(data);
    });

    it('should set statusCode', () => {

        res.status(401);
        expect(res.statusCode).toEqual(401);
    });

    it('should chain status', () => {

        res.status(200).send('Success!');

        expect(res.statusCode).toEqual(200);
        expect(res.sent).toEqual('Success!');
    });
});
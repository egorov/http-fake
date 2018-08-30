describe('SplitStringToChunks', () => {

    const split = require('../src/SplitStringToChunks'),
        value = '{"firstName":"Jack","lastName":"Sparrow"}';

    it('chunk should be 10 chars', () => {

        const chunks = split(value, 10);

        expect(chunks[0]).toEqual('{"firstNam');
        expect(chunks[1]).toEqual('e":"Jack",');
        expect(chunks[2]).toEqual('"lastName"');
        expect(chunks[3]).toEqual(':"Sparrow"');
        expect(chunks[4]).toEqual('}');
    });

    it('chunk should be 11 chars', () => {

        const chunks = split(value, 11);

        expect(chunks[0]).toEqual('{"firstName');
        expect(chunks[1]).toEqual('":"Jack","l');
        expect(chunks[2]).toEqual('astName":"S');
        expect(chunks[3]).toEqual('parrow"}');
    });

    it('chunk should be 1 char', () => {

        const chunks = split('12345', 1);

        expect(chunks[0]).toEqual('1');
        expect(chunks[1]).toEqual('2');
        expect(chunks[2]).toEqual('3');
        expect(chunks[3]).toEqual('4');
        expect(chunks[4]).toEqual('5');
    });

    it('chunk should be 2 chars', () => {

        const chunks = split('11223344', 2);

        expect(chunks[0]).toEqual('11');
        expect(chunks[1]).toEqual('22');
        expect(chunks[2]).toEqual('33');
        expect(chunks[3]).toEqual('44');
    });
});
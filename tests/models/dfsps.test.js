const dfspsModel=require('../../models/dfsps');

describe("Models: dfsps", () => {
    const expected=dfspsModel.getDfsps();

    test('Check dsfps models',async ()=>{
        expect(dfspsModel.getDfsps()).toEqual(expected);
    })
})
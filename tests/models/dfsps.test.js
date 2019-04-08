const {getDfsps}=require('../../models/dfsps');

describe("Models: dfsps", () => {
    const expected=getDfsps();
    test('Check dsfps models',async ()=>{
        expect(getDfsps()).toEqual(expected);
    })
})
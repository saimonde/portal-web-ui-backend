const {getDfsps}=require('../../models/dfsps');
const expect = require("chai").expect;

describe("Models: dfsps", async() => {
    const expected=await getDfsps();

    console.log("*********DFSPS");
    console.log(expected);

    it("should respond as expected",()=> {
      expect(expected).to.be.an('array')
    });
});
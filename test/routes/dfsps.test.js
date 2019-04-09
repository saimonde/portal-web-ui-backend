const {getDfsps}=require('../../models/dfsps');
const server=require('../../index');
const config = require("../../config/global")
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("routes: dfsps",() => {
    
    it("Respone: dfsps list", async ()=> {
        const expected = await getDfsps();
        chai
        .request(server)
        .get('/dfsps')
        .then((res)=>{
            //expect(res).to.have.status(200);
            res.body.should.be.a('object');
            res.status.should.eql(200);
            res.type.should.eql("application/json");
            expect(res.body).to.equal(expected);
         })
         .catch((err,res)=> {
            res.status.should.eql(500);
         });
        // .end((err, res) => {
        //   should.not.exist(err);
        //     try{
            // res.body.should.be.a('object');
            // res.status.should.eql(200);
            // res.type.should.eql("application/json");
            // expect(res.body).to.equal(expected);
        //     }catch(e){
        //         res.status.should.eql(500);
        //     }
        // });
    });
});

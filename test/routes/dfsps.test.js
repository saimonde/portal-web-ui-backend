const {getDfsps}=require('../../models/dfsps');
const server=require('../../index');
const config = require("../../config/global")
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("routes: dfsps",() => {
    
    it("Try{}: respond with dfsps list.", async ()=> {
        const expected = await getDfsps();
        chai
        .request(server)
        .get('/dfsps')
        .end((err, res) => {
            should.not.exist(err);
            res.body.should.be.an('array');
            res.status.should.eql(200);
            res.type.should.eql("application/json");
            expect(res.body).to.deep.equal(expected);
            res.body[0].should.include.keys(
                'id', 'name'
              );
        });
        // .then((res)=>{
        //     //expect(res).to.have.status(200);
        //     res.body.should.be.a('object');
        //     res.status.should.eql(200);
        //     res.type.should.eql("application/json");
        //     expect(res.body).to.equal(expected);
        //  })
        //  .catch((err,res)=> {
        //     res.status.should.eql(500);
        //  });
        
        
    });


    //Uncomment this after i have gained knowledge how to test try/catch blocks
    //this will fail unless we catch error 
    // it("Catch(e){}: on failure to get dfsps list ", async done=> {
    //     chai
    //     .request(server)
    //     .get('/dfsps')
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       res.status.should.eql(500);
    //     });
    //     done();
    // });


});

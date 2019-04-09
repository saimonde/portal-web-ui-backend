const server=require('../../index');
const {getUsers}=require('../../models/users');
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("routes: users",async() => {
    const expected =await getUsers();
    console.log('*******Users list');
    console.log(expected);
    it("should respond as expected", async ()=> {
        chai
        .request(server)
        .get('/users')
        .end((err, res) => {
          should.not.exist(err);
          expect(res.body).to.deep.equal(expected);
          res.status.should.eql(200);
          res.type.should.eql("application/json");
        });
    });
});

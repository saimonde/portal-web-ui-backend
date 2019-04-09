const {checkUserCredentials,getUsers}=require('../../models/users');
const expect = require("chai").expect;

describe("Models: users", () => {
    
    it("getUsers() test",async()=> {
        const users=await getUsers();
        console.log("*************users");
        console.log(users);
        expect(users).to.be.an('array');
    });

    it("checkUserCredentials() method",async()=> {
        const _nonuser = await checkUserCredentials('doesnotexisis','12345');
        const _user = await checkUserCredentials('amalbogast','12345')

        expect(_user).to.deep.equal({
            username:"amalbogast",
            password:"12345",
            active:"YES"
        });
        expect(_user).to.be.a('object');
        expect(_user).to.have.property('username');
        expect(_user).to.have.property('password');
        expect(_user).to.have.property('active');
        expect(_nonuser).to.equal(undefined);
    });
  });



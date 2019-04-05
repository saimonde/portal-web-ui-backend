const users=require('../../models/users');

describe("Models: users", () => {

    test('Check user credentials',async ()=>{
        expect(checkUserCredentials('amalbogast','12345')).toBe();
        expect(checkUserCredentials('doesnotexisis','12345')).toBe(undefined);
    })
})


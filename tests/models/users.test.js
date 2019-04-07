const userModel=require('../../models/users');

describe("Models: users", () => {

    test('Users list',async ()=>{
        const expected=userModel.getUsers();
        expect(userModel.getUsers()).toEqual(expected);
    });

    test('Check user credentials',async ()=>{
        const _nonuser = await userModel.checkUserCredentials('doesnotexisis','12345');
        const _user = await userModel.checkUserCredentials('amalbogast','12345')
        expect(_user).toEqual({
            username:"amalbogast",
            password:"12345",
            active:"YES"
        });
        expect(_nonuser).toEqual(undefined);
    });
})


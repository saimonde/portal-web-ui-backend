const {checkUserCredentials,getUsers}=require('../../models/users');

describe("Models: users", () => {

    test('Users list',async ()=>{
        const expected=getUsers();
        expect(getUsers()).toEqual(expected);
    });

    test('Check user credentials',async ()=>{
        const _nonuser = await checkUserCredentials('doesnotexisis','12345');
        const _user = await checkUserCredentials('amalbogast','12345')
        expect(_user).toEqual({
            username:"amalbogast",
            password:"12345",
            active:"YES"
        });
        expect(_nonuser).toEqual(undefined);
    });
})


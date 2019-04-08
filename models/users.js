const db=require('../config/db');
const users=[
    {
        username:"amalbogast",
        password:"12345",
        active:"YES"
    },
    {
        username:"samanangu",
        password:"12345",
        active:"YES"
    },
    {
        username:"rkishimba",
        password:"12345",
        active:"YES"
    },
    {
        username:"slosindilo",
        password:"12345",
        active:"YES"
    }
];

module.exports.getUsers=async ()=>{
    let userList=await users;
    return userList;
}
//Check if user with posted credentials exists
module.exports.checkUserCredentials=async (username,password)=>{
    let usersList = await this.getUsers();
    let user = await usersList.find(a => a.username === username && a.password === password);
    return user;
}
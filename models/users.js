const db=require('../config/db');

async function getUsers() {
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
    return users;
}

//Check if user with posted credentials exists
async function checkUserCredentials(username,password){
    let usersList = await this.getUsers();
    let user = await usersList.find(a => a.username === username && a.password === password);
    return user;
}



module.exports={
    getUsers,
    checkUserCredentials
}
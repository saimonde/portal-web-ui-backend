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
            "username":"slosindilo",
            "password":"12345",
            "active":"YES"
        }
    ];
    return users;
}

module.exports={
    getUsers,
}
const db=require('../config/db');
const role=require('./role')
const users=[
    {
        userid:1,
        firstname:"Aman",
        lastname:"Albogast",
        username:"amalbogast",
        password:"12345",
        active:"YES"
    },
    {
        userid:2,
        firstname:"Simon",
        lastname:"Manangu",
        username:"samanangu",
        password:"12345",
        active:"YES"
    },
    {
        userid:3,
        firstname:"Revocatus",
        lastname:"Kishimba",
        username:"rkishimba",
        password:"12345",
        active:"YES"
    },
    {
        userid:4,
        firstname:"Salim",
        lastname:"Losindilo",
        username:"slosindilo",
        password:"12345",
        active:"YES"
    }
];

const usersRoles=[
    {
        userid:1,
        role:role.Admin
    },
    {
        userid:1,
        role:role.Dfsp
    },
    {
        userid:3,
        role:role.Admin
    },
    {
        userid:4,
        role:role.Dfsp
    }
];

module.exports.getAllUsers=async ()=>{
    let userList=await users;
    return userList.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

module.exports.getUsersRoles=async ()=>{
    let roleList=await usersRoles;
    return roleList;
}
//Check if user with posted credentials exists
module.exports.checkUserCredentials=async (username,password)=>{
    let user = await users.find(a => a.username === username && a.password === password);
    (user !== undefined) ? delete user.password:user;
    return user;
}

module.exports.userRoles = async (userId)=>{
    let roles = await usersRoles.filter(a => a.userid === userId);
    let userRoles=[];
    roles.forEach((role)=>{
        userRoles.push(role.role);
    });
    return userRoles;
}

module.exports.getUserById = async (id)=>{
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

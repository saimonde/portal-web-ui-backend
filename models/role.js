// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = require("../config/global")

// Db connection
const db = new (require('../config/db'))(config.db);

module.exports.getRoles=async ()=>{
    let [roles]=await db.connection.query(
        'SELECT r.* FROM role r'
    );
    return roles;
}

module.exports.userRoles = async (id)=>{
    let q='SELECT r.roleId,r.roleName FROM role r JOIN userRole ur';
        q+=' ON r.roleId=ur.roleId JOIN user u ON ur.userId=u.userId';
        q+=' WHERE ur.userId=?';
    let [roles]= await db.connection.query(q,id);
    let userRoles=[];
    roles.forEach((role)=>{
        userRoles.push(role.roleName);
    });
    return userRoles;
}

module.exports.getAccessMenu = async (id)=>{
    
    let q='SELECT v.menuItemId,v.label,v.link,v.menuId,v.MainMenu,';
        q+='v.mainmenulink from v_user_roles_menu v where v.userId=?';
    let [result]= await db.connection.query(q,id);

    var menu_to_values = result.reduce((obj, item)=>{
        obj[item.MainMenu] = obj[item.MainMenu] || [];
        obj[item.MainMenu].push({label:item.label,link:item.link});
        return obj;
    }, {});

    //console.log(menu_to_values);
    
    var menus = Object.keys(menu_to_values).map((key)=>{
        return {memu: key,link:"#", subMenu: menu_to_values[key]};
    });

    return menus;
}

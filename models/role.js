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
    let q='SELECT r.roleId,r.roleName FROM roles r JOIN user_role ur';
        q+=' ON r.roleId=ur.roleId JOIN users u ON ur.userId=u.userId';
        q+=' WHERE ur.userId=?';
    let [roles]= await db.connection.query(q,id);
    let userRoles=[];
    roles.forEach((role)=>{
        userRoles.push(role.roleName);
    });
    return userRoles;
}

module.exports.getAccessMenu = async (id)=>{
    
    let q='SELECT v.taskId,v.taskName,v.childLink,v.childIcon,v.menuId,v.mainMenu,';
        q+='v.mainMenulink,v.mainMenuIcon from v_user_roles_menu v where v.userId=? order by v.menuId=1 desc,v.menuId asc';
    let [result]= await db.connection.query(q,id);

    var menu_to_values = result.reduce((obj, item)=>{
        obj[item.mainMenu] = obj[item.mainMenu] || [];
        obj[item.mainMenu].push({label:item.taskName,link:item.childLink,icon:item.childIcon});
        return obj;
    }, {});

    var menus = Object.keys(menu_to_values).map((key)=>{
        let menu = result.find(i => i.mainMenu === key);
        return {menu: key,link:menu.mainMenulink,icon:menu.mainMenuIcon, subMenu: menu_to_values[key]};
    });

    return menus;
}

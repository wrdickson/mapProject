//menu_view.js
define([
    'dhtmlxcommon',
    'dhtmlxmenu',
    'common/dispatcher',
    'jquery-ui'
], function(
    dhtmlx,
    dhtmlxMenuObject,
    dispatcher
){
	
	var Menu={};
    var monitorMenu;
	Menu.fireMenu = function(user){
        //clear the div
        //reqres.trigger("MapApp:reset-menu-region");
        monitorMenu = new dhtmlXMenuObject("menu-region", "dhx_web");
	    monitorMenu.addNewSibling(null, "file", "File", false);
	    monitorMenu.addNewChild("file", 0, "new", "New", false, null);
	    monitorMenu.addNewChild("new",1,"blah","Blah",false,null);
	    monitorMenu.addNewChild("new",1,"slah","Slah",false,null);
        monitorMenu.addNewSibling("file", "user", user.get("mtoUsername"), false);
        if(parseInt(user.get("mtoUserId")) == 0){
            monitorMenu.addNewChild("user", 1, "login", "Login", false, null);
        };
        if(user.get("mtoUserId") > 0){
            monitorMenu.addNewChild("user", 1, "logoff", "Logoff", false, null);
        };
	    monitorMenu.attachEvent("onClick", function(id, zoneId, cssState){
	        Menu.handleMenuClick(id, zoneId, cssState);
	    });
    }
    
    Menu.handleMenuClick = function(id, zoneId, cssState){
    	
        switch (id){
            case "login":
                dispatcher.trigger("menu:showLogin");
            break;
            case "logoff":
                //reqres.trigger("user:logoff");
            break;
        }
	    
	}
    
    //TODO event handlers on model change
    
    
	return Menu;
});
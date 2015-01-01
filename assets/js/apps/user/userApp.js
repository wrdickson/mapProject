//userApp.js
define([
    'backbone',
    'common/dispatch',
    'apps/user/views/userLoginView'

], function (
    Backbone,
    dispatch,
    UserLoginView

) {
    //private properties
    var user;
    var baseUrl;
    
    //private methods
    var logoff = function () {
        console.log("logging off . . . ");
        //call to the server, asking it to reset the user's key
        var param = {
            id: user.get("mtoUserId"),
            key: user.get("mtoUserKey")
        };
        //this will try to reset the user's key on the db
        $.get(baseUrl + "api/logoff/", param, function (data) {
            console.log("back from logoff:", data);
        });        
        //but we don't care on the client side.  wack the user
        var iUser = {
            id: 0,
            username: "Guest",
            permission: 0,
            key: 0
        };
        dispatch.trigger("MapApp:setUser",iUser);
    };
    
    var UserApp = {
    };
    
    UserApp.User = Backbone.Model.extend({
        initialize: function(){
            this.on("change", function () {
                console.log("userchange", this);
                
            });
        }
    });
    
    /*
    @param user an object
    */
    UserApp.initialize = function (iUser) {
        //set the private properties
        user = iUser;
        this.UserLoginView = UserLoginView;        
        baseUrl = dispatch.request("MapApp:getBaseUrl");
    };
    
    dispatch.on ("mapData:loaded", function (data) {
        console.log ("UserApp registers mapdData:loaded event");
    });
    
    dispatch.on("mapData:xLoaded", function (data) {
        console.log("xLoad", data);
        //data.f();
    });
    
    dispatch.on("user:logoff", function () {
        logoff();
    }); 

    
    return UserApp;
    

    


});
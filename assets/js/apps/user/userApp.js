//userApp.js
define([
    'backbone',
    'common/dispatcher',
    'apps/user/views/userLoginView'

], function (
    Backbone,
    dispatcher,
    UserLoginView
    

) {

    //private properties
    var user;
    
    
    //private methods
    
    
    var UserApp = {
    };
    
    UserApp.User = Backbone.Model.extend({
    
    });
    
    UserApp.initialize = function(user){
    
        //set the private property
        user = user;
    
        //debugging dispatcher . . .. 
                var req = dispatcher.request("tModel:get");
                console.log("x: ", req);

                var p = dispatcher.request('testParams:1','prop2');
                console.log("p:", p);
        
    }
    


    
    dispatcher.on ("mapData:loaded", function(data){
        console.log ("UserApp registers mapdData:loaded event");
    });
    
    dispatcher.on("mapData:xLoaded", function(data){
        console.log("xLoad", data);
        //data.f();
    });
    
    
    return UserApp;
    
    


});
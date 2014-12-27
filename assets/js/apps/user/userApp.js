//userApp.js
define([
    'backbone',
    'common/dispatcher'

], function (
    Backbone,
    dispatcher

) {
    
    var UserApp = {
    };
    
    UserApp.User = Backbone.Model.extend({
    
    });
    
    UserApp.initialize = function(){
    
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
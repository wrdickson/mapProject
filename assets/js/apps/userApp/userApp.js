//userApp

define([
    'apps/userApp/models/user'
], function(
    UserModel
){


var UserApp = {};

//private prop
var myPrivateVar = "somet";

//private method
var myPrivateMethod = function(){

}


UserApp.initialize = function(){
    
    UserApp.User = new UserModel();
    console.log("UserApp.User: ", UserApp.User);
    require(['app'], function(MapApp){
        MapApp.vent.trigger("another:event", "smithereens");
        MapApp.vent.trigger("some:event", "blithers");
    });
    
}


//  Subscriptions:
require(['app'], function( MapApp ){
    MapApp.vent.on("some:event", function(data){
        console.log("userApp registers 'some:event'", data);
    });
    

});


return UserApp;




});

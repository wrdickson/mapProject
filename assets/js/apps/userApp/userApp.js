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
    
}


//  Event Subscriptions:
require(['app'], function( MapApp ){




    
});


return UserApp;




});

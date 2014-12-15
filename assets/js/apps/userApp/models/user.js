//user.js
define([
    'backbone'

], function(
    Backbone


){


var UserModel = Backbone.Model.extend({
    urlRoot: "./api/users",
    initialize: function(){
        this.on("change", function(){
            require(['app'], function(MapApp){
                MapApp.vent.trigger("userModel:change", this);
            });        
        });
        
        //check for a cookie
        
        //initialize user
    }

});



return UserModel;


});

//user.js
define([
    'backbone'
    

], function(
    Backbone


){


var UserModel = Backbone.Model.extend({
    urlRoot: "./api/users",
    initialize: function(){
        var self = this;
        this.on("change", function(){
            require(['app'], function(MapApp){
                MapApp.vent.trigger("userModel:change", self);
            });        
        });
    }

});



return UserModel;


});
